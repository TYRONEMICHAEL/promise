use promise_ruleset_derive::Ruleset;
use std::error::Error;

pub trait Condition {
    fn validate<'info>(&self) -> Result<(), Box<dyn Error>>;
}

pub trait Guard: Condition {
    fn size() -> usize;
}

pub struct StartDate {
    pub date: i64,
}

impl Condition for StartDate {
    fn validate<'info>(&self) -> Result<(), Box<dyn Error>> {
        Ok(())
    }
}

impl Guard for StartDate {
    fn size() -> usize {
        8
    }
}

#[derive(Ruleset)]
pub struct Ruleset {
    pub start_date: Option<StartDate>,
}

fn main() {
    let ruleset = Ruleset {
        start_date: Some(StartDate { date: 0 }),
    };
    let size = ruleset.size();
    if size != 8 {
        panic!("Expected size 8, got {}", size);
    }
}
