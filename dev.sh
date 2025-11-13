#!/usr/bin/env bash
SESSION="amapet"

if [ "$1" = "stop" ]; then
  podman kill "$(podman ps -q)"
  tmux kill-session -t $SESSION 2>/dev/null
else
  # Kill existing session if it exists
  tmux kill-session -t $SESSION 2>/dev/null

  # Create new session with first window
  tmux new-session -d -s $SESSION -n "db"

  # Split into 2 vertical panes (top/bottom)
  tmux split-window -h -t $SESSION:db.0

  # Adjust pane sizes to be equal
  tmux select-layout -t $SESSION:db even-horizontal

  # New window
  tmux new-window -t $SESSION -n "app"

  # Split into 2 vertical panes (top/bottom)
  tmux split-window -h -t $SESSION:app.0

  # Adjust pane sizes to be equal
  tmux select-layout -t $SESSION:app even-horizontal

  # Pane 0 (top): Database
  tmux send-keys -t $SESSION:db.0 "cd database && podman compose up" C-m

  # Pane 1 (bottom): mongodb-compass
  tmux send-keys -t $SESSION:db.1 "mongodb-compass 'mongodb://hpdev:engage4kha@localhost:27017'" C-m

  # Pane 0 (top): Backend
  tmux send-keys -t $SESSION:app.0 "cd backend && npm run clean && npm i && npm start" C-m

  # Pane 1 (bottom): Frontend
  tmux send-keys -t $SESSION:app.1 "cd frontend && npm run clean && npm i && npm start" C-m

  # Select backend pane by default
  tmux select-pane -t $SESSION:app.0

  # Attach to session
  tmux attach-session -t $SESSION
fi
