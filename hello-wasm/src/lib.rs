use wasm_bindgen::prelude::*;

// Import alert function from JavaScript
#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

// Use JavaScript alert function in a new function written in Rust
// then export it
#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}