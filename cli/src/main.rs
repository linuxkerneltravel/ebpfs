use std::env;
use colored::Colorize;
use std::error::Error;
use serde::{Deserialize, Serialize};

static mut DATA: Vec<Index> = Vec::new();

#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();

    let help = [
        format!("{}", "Welcome to cli!".green()),
        format!("{}", "Usage: ./cli <command>"),
        format!("{}", "Commands:"),
        format!("   {} {} {}", "help", "".yellow(), "Display this help".cyan()),
        format!("   {} {} {}", "search", "<keyword>".yellow(), "Search for a keyword".cyan()),
        format!("   {} {} {}", "run", "<org> <project>".yellow(), "Run target project (using Docker)".cyan()),
        format!("   {} {} {}", "run", "<path>".yellow(), "Run target file".cyan()),
        format!("   {} {} {}", "run", "<id>".yellow(), "Get ebpf package by id".cyan()),
    ];

    if args.len() < 2 {
        println!("{}", help.join("\n"));
    }

    if args[1].eq("help") {
        println!("{}", help.join("\n"));
    }

    // 匹配指令
    if args[1].eq("search") {
        let data = search(&args[2]).await.unwrap();
        let data: Message = serde_json::from_str(&data).unwrap();

        println!("{}", "Search results:".green());
        println!("{} {}", "result count:", data.data.len());
        println!("You can use result id to run it");
        data.data.iter().for_each(|index| {
            println!();
            println!("{} {}", "id:".yellow(), index.id);
            println!("{} {}", "organization:".yellow(), index.organization);
            println!("{} {}", "project:".yellow(), index.project);
            println!("{} {}", "description:".yellow(), trim(&index.content));
            println!();
        });

        // 写入缓存
        unsafe {
            DATA = data.data;
        }

        return;
    }

    if args[1].eq("run") && args.len() == 3 {}
    if args[1].eq("run") && args.len() == 2 {}
}

// 根据关键字搜索 ebpf 包
async fn search(keyword: &str) -> Result<String, Box<dyn Error>> {
    let res =
        reqwest::Client::builder()
            .build().unwrap()
            .get(&format!("https://ebpfs.vercel.app/api/search?query={}", keyword))
            .send().await?
            .text().await?;

    Ok(res)
}

// 根据 id 获取 ebpf 包
async fn repository(id: &str) -> Result<String, Box<dyn Error>> {
    let res =
        reqwest::Client::builder()
            .build().unwrap()
            .get(&format!("https://ebpfs.vercel.app/repository?id={}", id))
            .send().await?
            .text().await?;

    Ok(res)
}

// 裁剪搜索结果
fn trim(text: &str) -> String {
    if let Some(summary_index) = text.find("summary:") {
        if let Some(dash_index) = text[summary_index..].find("---") {
            return text[summary_index + 9..summary_index + dash_index].to_string();
        }
    }
    text.to_string()
}

// 执行 Docker 快速启动 ebpf 包
fn exec() {}

// 从 repo 获取 docker image
fn get_image() {}

#[derive(Serialize, Deserialize, Debug)]
struct Message {
    status: i32,
    message: String,
    data: Vec<Index>,
}

#[derive(Serialize, Deserialize, Debug)]
struct Index {
    id: String,
    url: String,
    organization: String,
    project: String,
    readme: String,
    content: String,
    author: Vec<String>,
    tags: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct Repository {
    id: String,
    account: String,
    created: String,
    update: String,
    organization: String,
    project: String,
    version: String,
    readme: String,
    #[serde(rename(serialize = "type", deserialize = "type"))]
    package_type: String,
    repository: String,
    entry: String,
    author: Vec<String>,
    tags: Vec<String>,
}

