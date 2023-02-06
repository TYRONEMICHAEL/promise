#[test]
fn tests() {
    let t = trybuild::TestCases::new();
    t.pass("tests/enabled.rs");
    t.pass("tests/size.rs");
}
