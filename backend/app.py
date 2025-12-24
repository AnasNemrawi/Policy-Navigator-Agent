# Backend API Server for Policy Navigator Agent
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import sys
from datetime import datetime
import time

# Add parent directory to path to import config
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from config import AIXPLAIN_API_KEY, AGENT_ID, SESSIONS_FOLDER

os.environ["AIXPLAIN_API_KEY"] = AIXPLAIN_API_KEY

from aixplain.factories import AgentFactory
from aixplain.modules.agent.output_format import OutputFormat

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Cache agent instance
_agent_cache = None

def get_agent():
    """Get or initialize the agent"""
    global _agent_cache
    if _agent_cache is None:
        try:
            _agent_cache = AgentFactory.get(AGENT_ID)
            print(f"✓ Retrieved agent: {_agent_cache.name}")
        except Exception as e:
            print(f"✗ Failed to retrieve agent: {e}")
            raise
    return _agent_cache

def build_query_with_url(question, url):
    """Build query with optional URL"""
    if url and url.strip():
        return f"URL: {url}\n\nQuestion: {question}"
    return question

def build_user_display(question, url):
    """Build user display text"""
    if url and url.strip():
        return f"{question}\n\n🔗 URL: {url}"
    return question

def build_conversation_context(messages):
    """Build conversation context from message history"""
    if len(messages) <= 1:
        return ""
    
    context = "\n\n".join([
        f"{'User' if msg['role'] == 'user' else 'Assistant'}: {msg['content']}"
        for msg in messages[:-1]
    ])
    return context

def add_context_to_query(query, context):
    """Add conversation context to query"""
    if context:
        return f"Previous conversation:\n{context}\n\nCurrent question: {query}"
    return query

def check_out_of_domain_response(text):
    """Check if response indicates out of domain"""
    out_of_domain_indicators = [
        "i don't know",
        "i cannot",
        "i can't",
        "not in my knowledge",
        "outside my domain",
        "not available in my sources"
    ]
    text_lower = text.lower()
    return any(indicator in text_lower for indicator in out_of_domain_indicators)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy"})

@app.route('/api/query', methods=['POST'])
def process_query():
    """Process agent query"""
    try:
        data = request.json
        question = data.get('question', '').strip()
        url = data.get('url', '').strip()
        messages = data.get('messages', [])
        
        if not question:
            return jsonify({"error": "Question is required"}), 400
        
        # Get agent
        agent = get_agent()
        
        # Build query and user display
        final_query = build_query_with_url(question, url)
        user_display = build_user_display(question, url)
        
        # Build conversation context
        conversation_context = build_conversation_context(messages)
        final_query = add_context_to_query(final_query, conversation_context)
        
        # Run agent
        response = agent.run(
            query=final_query,
            output_format=OutputFormat.MARKDOWN
        )
        
        # Extract response
        output_text = response.data.output if hasattr(response.data, 'output') else str(response.data)
        
        # Check if out of domain
        is_out_of_domain = check_out_of_domain_response(output_text)
        
        return jsonify({
            "success": True,
            "response": output_text,
            "user_display": user_display,
            "is_out_of_domain": is_out_of_domain
        })
        
    except Exception as e:
        print(f"Error processing query: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/sessions', methods=['GET'])
def get_sessions():
    """Get all saved sessions"""
    try:
        sessions = {}
        
        if os.path.exists(SESSIONS_FOLDER):
            for filename in os.listdir(SESSIONS_FOLDER):
                if filename.startswith('session_') and filename.endswith('.json'):
                    filepath = os.path.join(SESSIONS_FOLDER, filename)
                    with open(filepath, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        sessions[int(data['id'])] = data
        
        return jsonify({"sessions": sessions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sessions', methods=['POST'])
def create_session():
    """Create a new session"""
    try:
        session_id = int(time.time() * 1000)
        session = {
            'id': session_id,
            'created_at': datetime.now().isoformat(),
            'messages': []
        }
        
        if not os.path.exists(SESSIONS_FOLDER):
            os.makedirs(SESSIONS_FOLDER)
        
        filename = f"session_{session_id}.json"
        filepath = os.path.join(SESSIONS_FOLDER, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(session, f, indent=2, ensure_ascii=False)
        
        return jsonify({"session": session})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sessions/<int:session_id>', methods=['PUT'])
def update_session(session_id):
    """Update a session"""
    try:
        data = request.json
        messages = data.get('messages', [])
        
        session = {
            'id': session_id,
            'created_at': data.get('created_at', datetime.now().isoformat()),
            'messages': messages
        }
        
        if not os.path.exists(SESSIONS_FOLDER):
            os.makedirs(SESSIONS_FOLDER)
        
        filename = f"session_{session_id}.json"
        filepath = os.path.join(SESSIONS_FOLDER, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(session, f, indent=2, ensure_ascii=False)
        
        return jsonify({"session": session})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sessions/<int:session_id>', methods=['DELETE'])
def delete_session(session_id):
    """Delete a session"""
    try:
        filename = f"session_{session_id}.json"
        filepath = os.path.join(SESSIONS_FOLDER, filename)
        
        if os.path.exists(filepath):
            os.remove(filepath)
            return jsonify({"success": True})
        else:
            return jsonify({"error": "Session not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

