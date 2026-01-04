# Policy Navigator Agent

A comprehensive AI-powered knowledge assistant for education policy guidance, built with the aiXplain platform. This application provides authoritative answers about education policies, federal requirements, and educational guidance by leveraging RAG (Retrieval-Augmented Generation) technology with multiple data sources.

## 📋 Overview

The Policy Navigator Agent is a full-stack web application that combines:

- **Jupyter Notebook** - Model building and knowledge base setup using aiXplain SDK
- **Flask Backend API** - RESTful API server for processing queries
- **React Frontend** - Modern, responsive web interface with dark mode support

The system uses an intelligent AI agent that retrieves information from three specialized sources:

1. **PDF Knowledge Base** - Indexed education policy documents
2. **SQL Database** - ESEA Report Card guidelines and federal requirements
3. **Web Scraper** - Real-time content extraction from education policy websites

## ✨ Features

### Core Functionality

- 🤖 **Intelligent AI Agent** - GPT-4o mini powered agent with selective tool usage
- 📚 **Multi-Source RAG** - Retrieves information from PDFs, databases, and web content
- 💬 **Conversational Interface** - Natural language queries with conversation history
- 🔗 **URL Support** - Optionally provide URLs for web scraping and analysis
- 📝 **Session Management** - Create, switch, and manage multiple conversation sessions
- 💾 **Persistent Storage** - All conversations are saved and can be resumed

### User Interface

- 🎨 **Modern React UI** - Clean, intuitive interface with smooth animations
- 🌓 **Dark Mode Toggle** - Located in the upper right corner, persists across sessions
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🔔 **Smart Notifications** - Real-time feedback for user actions
- 📊 **Markdown Rendering** - Beautifully formatted responses with proper citations

### Technical Features

- ⚡ **Fast Response Times** - Optimized agent with intelligent tool selection
- 🔍 **Semantic Search** - FAISS-powered vector search with Snowflake Arctic embeddings
- 📄 **Advanced Chunking** - Sentence-based chunking with overlap for context continuity
- 🎯 **Selective Tool Usage** - Agent intelligently chooses the right tool for each query
- 📖 **Source Citations** - All responses include clear source attribution

## 🏗️ Architecture

### Model Building (Notebook)

The `RAG_knowledge_assistant.ipynb` notebook is the foundation of the system. It builds:

#### 1. **PDF Knowledge Index**

- **Purpose**: Creates a searchable vector index from education policy PDFs
- **Technology**:
  - Uses `IndexFactory` from aiXplain SDK
  - Embedding Model: Snowflake Arctic (`678a4f8547f687504744960a`)
  - Vector Search: FAISS with AVX2 support
- **Features**:
  - Extracts text from PDF documents using PyPDF2
  - Advanced sentence-based chunking (10 sentences per chunk, 2 sentence overlap)
  - Rich metadata tagging (source, category, priority, tags)
  - Semantic search with relevance scoring
  - Metadata filtering capabilities

#### 2. **SQL Database Tool**

- **Purpose**: Provides access to ESEA Report Card guidelines database
- **Technology**:
  - SQLite database with CSV import
  - `SQLTool` from aiXplain SDK
  - Automatic schema inference
- **Features**:
  - Read/write query support
  - Column name cleaning for SQLite compatibility
  - Comprehensive error handling

#### 3. **Web Scraper Tool**

- **Purpose**: Extracts content from education policy websites
- **Technology**:
  - Custom utility model using BeautifulSoup4
  - `ModelFactory.create_utility_model()` from aiXplain SDK
- **Features**:
  - Scrapes predefined education.gov pages
  - Follows first-level internal links
  - Limits output to 15 paragraphs per page for efficiency
  - Handles errors gracefully

#### 4. **AI Agent**

- **Purpose**: Orchestrates all tools to answer user queries
- **Technology**:
  - `AgentFactory` from aiXplain SDK
  - LLM: GPT-4o mini (`669a63646eb56306647e1091`)
  - Output Format: Markdown
- **Intelligence**:
  - **Selective Tool Usage**: Chooses the most appropriate tool based on query content
  - **Smart Routing**:
    - URLs → Web Scraper only
    - Cambridge School/CSVPA questions → PDF Index only
    - ESEA/Report Card questions → SQL Database only
    - "Save this" / "Remind me" → Note Saver Tool
    - "Show my notes" / "List notes" → List Notes Tool
    - "Read note" / "Open note" → Read Note Tool
    - General questions → PDF Index → SQL Database → Web Scraper (fallback)
  - **Citation Management**: Automatically includes source citations
  - **Context Awareness**: Maintains conversation history for follow-up questions

#### 5. **External Action Tools (Note Management System)**

**This system "External Tools" allow the agent to perform read/write actions on the file system.**

- **Tools Included**:
  1. **Note Saver**: Saves summaries/reminders to `user_notes/` (Write Action)
  2. **List Notes**: Retrieves a list of all saved files (Read Action)
  3. **Read Note**: Opens and reads specific file content (Read Action)
- **Technology**:
  - Custom Python function tools
  - `ModelFactory.create_utility_model()`
- **Features**:
  - Persistent storage of user insights
  - Timestamped file creation
  - Directory management and security checks
  - Demonstrates agent capability to **take action** beyond simple retrieval

### Backend API

The Flask backend (`backend/app.py`) provides:

- RESTful API endpoints for query processing
- Session management (CRUD operations)
- Agent initialization and caching
- Conversation context building
- Error handling and validation

### Frontend

The React frontend provides:

- Component-based architecture
- State management with React hooks
- Real-time UI updates
- Session persistence
- Dark mode with localStorage

## 🚀 Getting Started

### Prerequisites

- **Python 3.8+** - For backend and notebook
- **Node.js 16+ and npm** - For frontend
- **aiXplain Account** - For API access
- **Jupyter Notebook** - For running the model building notebook

### Step 1: Create aiXplain Account and Get API Key

1. Visit [aiXplain Platform](https://platform.aixplain.com/)
2. Sign up for a free account
3. Navigate to your profile/settings
4. Generate or copy your API key
5. Save it securely - you'll need it for the notebook and backend

### Step 2: Configure the Project

1. Clone or download this repository
2. Open `config.py` and update:
   ```python
   AIXPLAIN_API_KEY = "your-api-key-here"
   AGENT_ID = "your-agent-id-here"  # Will be generated in notebook
   ```

### Step 3: Run the Notebook (Model Building)

**This step must be completed first** - it builds the knowledge base and creates the agent.

1. Open `RAG_knowledge_assistant.ipynb` in Jupyter Notebook or JupyterLab
2. Install required libraries (first cell):

   ```python
   %pip install -q aixplain faiss-cpu pypdf pypdf2 pdfplumber PyPDF2 scikit-learn
   ```
3. Set your API key (second cell):

   ```python
   import os
   os.environ["AIXPLAIN_API_KEY"] = "your-api-key-here"
   ```
4. Run all cells sequentially:

   - **Cell 1**: Install dependencies
   - **Cell 2**: Set API key
   - **Cell 3**: Verify API key works
   - **Cell 4**: Extract PDF text
   - **Cell 5**: Configure chunking strategy
   - **Cell 6**: Create/retrieve PDF index
   - **Cell 7**: Upload records to index
   - **Cell 8**: Create SQL tool
   - **Cell 9**: Create web scraper tool
   - **Cell 10**: Create and deploy AI agent
   - **Cell 11**: Get agent ID
5. **Important**: After running the agent creation cell, copy the `AGENT_ID` from the output and update `config.py`:

   ```python
   AGENT_ID = "AGENT_API_KEY"  # Your actual agent ID
   ```
6. Test the agent with sample queries in the notebook

### Step 4: Set Up Backend

1. Navigate to backend directory:

   ```bash
   cd backend
   ```
2. Create virtual environment (recommended):

   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```
4. Verify `config.py` in the root directory has your API key and agent ID
5. Start the Flask server:

   ```bash
   python app.py
   ```

   The backend will run on `http://localhost:5000`

### Step 5: Set Up Frontend

1. Open a **new terminal** (keep backend running)
2. Navigate to frontend directory:

   ```bash
   cd frontend
   ```
3. Install dependencies:

   ```bash
   npm install
   ```
4. Start the development server:

   ```bash
   npm start
   ```

   The frontend will automatically open at `http://localhost:3000`

### Step 6: Use the Application

1. Open your browser to `http://localhost:3000`
2. Toggle dark mode using the button in the upper right corner
3. Use the sidebar to manage sessions
4. Enter questions in the input section
5. Optionally provide URLs for web scraping
6. View formatted responses with citations

## 📁 Project Structure

```
Policy-Navigator-Agent/
├── RAG_knowledge_assistant.ipynb  # Model building notebook (RUN FIRST)
├── config.py                       # Configuration (API keys, agent ID)
├── backend/
│   ├── app.py                      # Flask API server
│   └── requirements.txt            # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/             # React components
│   │   │   ├── ThemeToggle.js      # Dark mode toggle
│   │   │   ├── Sidebar.js          # Session management
│   │   │   ├── ChatDisplay.js      # Message display
│   │   │   ├── InputSection.js     # Query input
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── sessionService.js   # API service functions
│   │   ├── App.js                  # Main application
│   │   └── App.css                 # Styles
│   └── package.json                # Node dependencies
├── data/
│   ├── pdfs/                       # PDF documents
│   ├── ESEA_Report_Card_Guidelines.csv
│   └── ESEA_Report_Card_Guidelines.db
├── sessions/
│   └── Saved_Sessions/             # Saved conversation sessions
└── README.md                       # This file
```

## � Data Sources

The knowledge base is built from the following authoritative sources:

- **ESEA Report Card Guidelines**: [U.S. Department of Education Data](https://www2.ed.gov/records/ReportCards/index.html) - Comprehensive dataset on state and local report card requirements.
- **Education Policy Documents**: [Cambridge School Policies](https://www.csvpa.com/about/policies) - Internal PDF documents regarding careers and educational guidance.
- **Federal Education Laws**: [U.S. Department of Education](https://www.ed.gov/) - Real-time policy information scraped directly from official government sources.

## �🔧 Configuration

Edit `config.py` to configure:

- `AGENT_ID` - Your aiXplain agent ID (from notebook output)
- `AIXPLAIN_API_KEY` - Your aiXplain API key
- `SESSIONS_FOLDER` - Path to save session files
- `PAGE_TITLE` - Application title
- `SESSION_TITLE_MAX_LENGTH` - Maximum length for session titles

## 📊 API Endpoints

### Backend Endpoints

- `GET /api/health` - Health check
- `POST /api/query` - Process agent query
  ```json
  {
    "question": "Your question",
    "url": "Optional URL",
    "messages": [/* conversation history */]
  }
  ```
- `GET /api/sessions` - Get all saved sessions
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/<id>` - Update session
- `DELETE /api/sessions/<id>` - Delete session

## 🛠️ Tools and Technologies

### Notebook (Model Building)

- **aiXplain SDK** - Platform integration
- **FAISS** - Vector similarity search
- **PyPDF2/pypdf** - PDF text extraction
- **BeautifulSoup4** - Web scraping
- **SQLite** - Database management
- **Snowflake Arctic** - Embedding model

### Backend

- **Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing
- **aiXplain SDK** - Agent integration

### Frontend

- **React 18** - UI framework
- **React Markdown** - Markdown rendering
- **Axios** - HTTP client
- **CSS3** - Styling with dark mode support

## 🎯 How the Agent Works

1. **Query Analysis**: User submits a question (optionally with URL)
2. **Tool Selection**: Agent analyzes query and selects appropriate tool(s):
   - URL provided → Web Scraper
   - School-specific → PDF Index
   - Database-related → SQL Tool
   - General → PDF Index → SQL → Web Scraper (fallback)
3. **Information Retrieval**: Selected tool retrieves relevant information
4. **Response Generation**: LLM generates response with citations
5. **Formatting**: Response is formatted in Markdown with proper structure
6. **Display**: Frontend renders formatted response with citations

## � Example Scenarios

### Scenario 1: Federal Policy Query

**User:** "What are the responsibilities of an SEA for preparing a report card?"
**Agent:**

> ### SEA Report Card Responsibilities
>
> State Education Agencies (SEAs) have specific mandates under the ESEA:
>
> - **Data Collection**: SEAs must collect valid and reliable data from LEAs.
> - **Public Dissemination**: They are responsible for preparing and disseminating the State report card to the public.
> - **Format Requirements**: The report must be concise, understandable, and accessible to parents.
>
> #### Sources
>
> - ESEA Report Card Database - State Responsibilities Table

### Scenario 2: School-Specific Guidance

**User:** "What is the policy for academic transcripts at Cambridge School?"
**Agent:**

> ### Academic Transcript Policy
>
> The Cambridge School of Visual & Performing Arts maintains strict guidelines for transcripts:
>
> 1. **Issuance**: Transcripts are issued upon successful completion of the program.
> 2. **Requests**: Students must submit a formal request to the registry.
> 3. **Withholding**: Transcripts may be withheld if there are outstanding financial obligations.
>
> #### Sources
>
> - Careers and Educational Guidance Policy 2025-26

### Scenario 3: External Action (Note Management)

**User:** "Save a note about these transcript requirements."
**Agent:**

> I have successfully saved a note about **Academic Transcript Policy** to `user_notes/note_2026-01-02_14-30-00.txt`.
>
> #### Sources
>
> - User Notes System

**User:** "List my notes."
**Agent:**

> Found the following notes:
>
> - note_2026-01-02_14-30-00.txt
> - note_2026-01-01_09-15-00.txt
>
> #### Sources
>
> - User Notes System

## �🔮 Future Improvements

### Model & Knowledge Base Enhancements

- [ ] **Multi-PDF Support**: Expand knowledge base with additional policy documents
- [ ] **Incremental Indexing**: Add new documents without rebuilding entire index
- [ ] **Advanced Filtering**: Implement date ranges, document types, and priority filters
- [ ] **Citation Links**: Make citations clickable with direct links to source documents
- [ ] **Confidence Scores**: Display relevance scores for retrieved information
- [ ] **Multi-language Support**: Support queries in multiple languages

### Agent Intelligence

- [ ] **Query Understanding**: Improve intent recognition and query classification
- [ ] **Multi-hop Reasoning**: Enable complex queries requiring multiple tool calls
- [ ] **Answer Synthesis**: Better integration of information from multiple sources
- [ ] **Fact Verification**: Cross-reference information across sources
- [ ] **Temporal Awareness**: Handle time-sensitive queries and policy updates

### User Experience

- [ ] **Export Conversations**: Download conversations as PDF or Markdown
- [ ] **Search History**: Search through past conversations
- [ ] **Favorites/Bookmarks**: Save important responses
- [ ] **Sharing**: Share conversations via links
- [ ] **Voice Input**: Add speech-to-text for queries
- [ ] **Mobile App**: Native mobile application

### Data & Integration

- [ ] **Real-time Updates**: Automatically update knowledge base from new sources
- [ ] **API Integration**: Connect to external education policy APIs
- [ ] **Database Expansion**: Add more structured data sources
- [ ] **Custom Data Sources**: Allow users to upload their own documents
- [ ] **Version Control**: Track changes to knowledge base over time

## 📝 Notes

- The notebook must be run **before** starting the backend/frontend
- The agent ID from the notebook must be copied to `config.py`
- Session data is stored in JSON files in `sessions/Saved_Sessions/`
- The React app maintains the same box sizes and layout as the original Streamlit UI
- All API keys should be kept secure and not committed to version control

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

See `LICENSE` file for details.

## 🙏 Acknowledgments

- **aiXplain Platform** - For providing the AI infrastructure and SDK
- **React** - For the frontend user interface
- **Flask** - For the backend API server

---

**Built with ❤️ for education policy guidance**
