![Logo](https://raw.githubusercontent.com/BALMUZDAQ-STUDIO/Balmuzdaq-logos/refs/heads/main/red_logo.png)

# Hack Ai

An AI tool that analyzes uploaded PDF documents and automatically generates test questions from them, built around a locally-run Llama model.

**3rd place, $1,000 — Sharpist 2024 AI Hackathon** (Microsoft Developers Community Uzbekistan × IT Investments Center). Among 3,000+ participants from across the CIS, this was the only winning team not based in Uzbekistan.

Video: https://drive.google.com/file/d/1hgY0aqyORKZg3F5hjGV9fKnecGYc4XCR/view?usp=sharing

## How it works

The document is parsed, its text extracted, and passed to a locally hosted Llama model (via `llama-cpp-python`) which generates test questions. A Flask web app wraps the pipeline, and a lightweight remote API is also in progress for calling the model over the network.

To run it, download the Llama model and place it at `llm_chatbot/models/llama-2-7b-chat.Q4_K_M.gguf`. Model link: https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGML

## Authors

- [@BALMUZDAQ-STUDIO](https://github.com/BALMUZDAQ-STUDIO)

## Environment Variables

To run this project, you will need to add the following environment variable to your `.env` file:

`SECRET_KEY`

## Run Locally

Clone the project

```bash
  git clone https://github.com/BALMUZDAQ-STUDIO/hack-Ai
  cd hack-Ai
```

Install dependencies

```bash
  pip install -r requirements.txt
  npm install
```

Start the server

```bash
  python app.py
```

## Support

For support, email balmuzdaq.studio@gmail.com

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
