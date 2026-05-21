use axum::{
    extract::Multipart,
    http::Method,
    response::Json,
    routing::{get, post},
    Router,
};

use csv::ReaderBuilder;
use futures::future::join_all;
use regex::Regex;
use serde::{Deserialize, Serialize};

use std::{
    env,
    net::SocketAddr,
};

use tower_http::cors::{Any, CorsLayer};

use trust_dns_resolver::{
    config::{ResolverConfig, ResolverOpts},
    TokioAsyncResolver,
};

#[derive(Debug, Serialize, Deserialize, Clone)]
struct EmailResult {
    email: String,
    status: String,
    reason: String,
    mx_found: bool,
    is_disposable: bool,
    is_role_based: bool,
}

const DISPOSABLE_DOMAINS: &[&str] = &[
    "mailinator.com",
    "guerrillamail.com",
    "tempmail.com",
    "throwaway.email",
    "yopmail.com",
    "sharklasers.com",
    "guerrillamailblock.com",
    "grr.la",
    "guerrillamail.info",
    "guerrillamail.biz",
    "guerrillamail.de",
    "guerrillamail.net",
    "guerrillamail.org",
    "spam4.me",
    "trashmail.com",
    "trashmail.me",
    "dispostable.com",
    "mailnull.com",
    "spamgourmet.com",
    "maildrop.cc",
    "fakeinbox.com",
    "tempr.email",
    "discard.email",
    "spamhereplease.com",
    "getnada.com",
    "inboxbear.com",
    "20minutemail.com",
    "10minutemail.com",
];

const ROLE_BASED: &[&str] = &[
    "admin",
    "administrator",
    "webmaster",
    "hostmaster",
    "postmaster",
    "info",
    "support",
    "help",
    "contact",
    "sales",
    "marketing",
    "noreply",
    "no-reply",
    "donotreply",
    "abuse",
    "security",
    "billing",
    "accounts",
    "hr",
    "jobs",
    "careers",
    "team",
];

fn is_valid_syntax(email: &str) -> bool {
    let re = Regex::new(
        r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
    ).unwrap();

    re.is_match(email)
}

fn is_disposable(email: &str) -> bool {
    let domain = email
        .split('@')
        .nth(1)
        .unwrap_or("")
        .to_lowercase();

    DISPOSABLE_DOMAINS.contains(&domain.as_str())
}

fn is_role_based(email: &str) -> bool {
    let local = email
        .split('@')
        .next()
        .unwrap_or("")
        .to_lowercase();

    ROLE_BASED.contains(&local.as_str())
}

async fn check_mx(domain: &str) -> bool {
    let resolver = TokioAsyncResolver::tokio(
        ResolverConfig::default(),
        ResolverOpts::default(),
    );

    match resolver.mx_lookup(domain).await {
        Ok(mx) => !mx.iter().collect::<Vec<_>>().is_empty(),
        Err(_) => false,
    }
}

async fn verify_email(email: String) -> EmailResult {
    let email = email.trim().to_lowercase();

    if !is_valid_syntax(&email) {
        return EmailResult {
            email,
            status: "invalid".to_string(),
            reason: "Invalid email syntax".to_string(),
            mx_found: false,
            is_disposable: false,
            is_role_based: false,
        };
    }

    let domain = email
        .split('@')
        .nth(1)
        .unwrap_or("")
        .to_string();

    let disposable = is_disposable(&email);
    let role = is_role_based(&email);
    let mx = check_mx(&domain).await;

    if disposable {
        return EmailResult {
            email,
            status: "invalid".to_string(),
            reason: "Disposable email domain".to_string(),
            mx_found: mx,
            is_disposable: true,
            is_role_based: role,
        };
    }

    if !mx {
        return EmailResult {
            email,
            status: "invalid".to_string(),
            reason: "No MX records found — domain cannot receive email".to_string(),
            mx_found: false,
            is_disposable: false,
            is_role_based: role,
        };
    }

    let status = if role {
        "risky".to_string()
    } else {
        "valid".to_string()
    };

    let reason = if role {
        "Role-based address — low engagement likely".to_string()
    } else {
        "Looks good".to_string()
    };

    EmailResult {
        email,
        status,
        reason,
        mx_found: true,
        is_disposable: false,
        is_role_based: role,
    }
}

async fn upload_csv(mut multipart: Multipart) -> Json<Vec<EmailResult>> {
    let mut emails: Vec<String> = Vec::new();

    while let Some(field) = multipart.next_field().await.unwrap_or(None) {
        let data = field.bytes().await.unwrap_or_default();

        let content = String::from_utf8_lossy(&data).to_string();

        let mut rdr = ReaderBuilder::new()
            .has_headers(true)
            .flexible(true)
            .from_reader(content.as_bytes());

        for result in rdr.records() {
            if let Ok(record) = result {
                for field in record.iter() {
                    let value = field.trim().to_string();

                    if value.contains('@') {
                        emails.push(value);
                        break;
                    }
                }
            }
        }
    }

let batch_size = 10;
let mut all_results = Vec::new();

for chunk in emails.chunks(batch_size) {

    let tasks: Vec<_> = chunk
        .iter()
        .cloned()
        .map(verify_email)
        .collect();

    let batch_results = join_all(tasks).await;

    all_results.extend(batch_results);
}

Json(all_results)
}

async fn health() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "ok",
        "service": "email-verifier"
    }))
}

#[tokio::main]
async fn main() {

    // Dynamic Render port
    let port: u16 = env::var("PORT")
        .unwrap_or_else(|_| "8081".to_string())
        .parse()
        .unwrap();

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/health", get(health))
        .route("/verify", post(upload_csv))
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));

    println!("🚀 Backend running on port {}", port);

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .unwrap();

    axum::serve(listener, app)
        .await
        .unwrap();
}