// Session management service
export const loadSessions = async () => {
  try {
    const response = await fetch('/api/sessions');
    const data = await response.json();
    return data.sessions || {};
  } catch (error) {
    console.error('Error loading sessions:', error);
    return {};
  }
};

export const createNewSession = async () => {
  try {
    const response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.session;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

export const saveSession = async (sessionId, messages) => {
  try {
    // Load existing session to preserve created_at
    const sessions = await loadSessions();
    const existingSession = sessions[sessionId];
    
    const response = await fetch(`/api/sessions/${sessionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        created_at: existingSession?.created_at || new Date().toISOString()
      }),
    });
    const data = await response.json();
    return data.session;
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
};

export const deleteSession = async (sessionId) => {
  try {
    const response = await fetch(`/api/sessions/${sessionId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};

