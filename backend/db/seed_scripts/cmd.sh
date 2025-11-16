#!/usr/bin/env bash

podman exec -i mongodb_auth mongosh "mongodb://hpdev:engage4kha@localhost:27017" <"00_settings_question-intentions.js"
