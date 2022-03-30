# MSLA-Intro-To-Wasm Demos

## Demo 1: Hello Wasm with html file
- cd hello-wasm
- wasm-pack build --target web
- serve
- click on simple frontend

## Demo 2: Hello Wasm with npm project
- cd hello-wasm
- wasm-pack build --target bundler
- cd npm-frontend
- npm run start

## Demo 3: Wasm Game Of Life
- cd wasm-game-of-life
- wasm-pack build
- cd frontend
- npm run start

## Demo 4: Hello World in host runtime 
- cd hello-world
- cargo build --target wasm32-wasi
- wasmtime ./target/wasm32-wasi/debug/hello-world.wasm