# AI-Powered Todo App

![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4.1--nano-green)

A modern Todo application enhanced with AI capabilities to help you manage your tasks more effectively. This app combines the simplicity of a traditional Todo list with powerful AI features to provide task suggestions and insights.

## ✨ Features

### Core Functionality
- Create, complete, and delete tasks
- Persistent storage using localStorage
- Clean, responsive UI built with Tailwind CSS and shadcn/ui components

### AI-Powered Features
- **Task Suggestions**: Hover over any task to receive AI-generated suggestions on how to get started
- **Task Classification**: Automatically identifies complex tasks and generates humorous memes to lighten the mood
- **Real-time AI Responses**: Utilizes OpenAI's GPT models to provide contextual assistance

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or Bun package manager
- OpenAI API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Pmahindra93/Todo_App.git
   cd Todo_App
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   bun install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development servers
   ```bash
   # In one terminal, start the backend server
   npm run server
   
   # In another terminal, start the frontend
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Tech Stack

### Frontend
- **React**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components

### Backend
- **Express**: Node.js web application framework
- **OpenAI API**: AI capabilities for task suggestions and classification

### AI Integration
- **Vercel AI SDK**: For streaming AI responses
- **OpenAI GPT-4o-mini**: For generating task suggestions and meme content

## 📝 Usage

1. **Adding Tasks**: Type your task in the input field and click "Add Todo" or press Enter
2. **Task Suggestions**: Hover over any incomplete task to see AI-generated suggestions on how to get started
3. **Completing Tasks**: Click the checkbox to mark a task as complete
4. **Deleting Tasks**: Click the trash icon to remove a task
5. **Task Classification**: Complex tasks will automatically display a humorous meme

## 🧠 How the AI Works

- **Task Suggestions**: When you hover over a task, the app sends the task description to the OpenAI API, which generates a practical suggestion on how to get started
- **Task Classification**: The app analyzes each task to determine if it's complex or large in scope. If identified as a large task, it generates a humorous meme to lighten the mood

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [OpenAI](https://openai.com/) for providing the AI models
- [Vercel](https://vercel.com/) for the AI SDK
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
