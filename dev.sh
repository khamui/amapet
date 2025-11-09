#!/usr/bin/env bash

SESSION="dev"

# Kill existing session if it exists
tmux kill-session -t $SESSION 2>/dev/null

# Create new session with first window
tmux new-session -d -s $SESSION -n "services"

# Split into 3 vertical panes
tmux split-window -v -t $SESSION:services
tmux split-window -h -t $SESSION:services.1
tmux split-window -v -t $SESSION:services.2

# Adjust pane sizes (optional - makes them more equal)
tmux select-layout -t $SESSION:services even-horizontal

# Pane 0 (top left): Database
tmux send-keys -t $SESSION:services.0 "cd database && podman compose up" C-m

# Pane 1 (bottom left): Backend
tmux send-keys -t $SESSION:services.1 "cd backend && npm run clean && npm i && npm start" C-m

# Pane 2 (top right): Frontend
tmux send-keys -t $SESSION:services.2 "cd frontend && npm run clean && npm i && npm start" C-m

# Pane 3 (bottom right): mongodb-compass
tmux send-keys -t $SESSION:services.3 "mongodb-compass --url 'mongodb://hpdev:engage4kha@localhost:27017/helpaws?authSource=admin'" C-m

# Select backend pane by default
tmux select-pane -t $SESSION:services.1

# Attach to session
tmux attach-session -t $SESSION
