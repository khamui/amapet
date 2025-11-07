{
  description = "Angular + Node + Docker monorepo";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            nodePackages.npm
            podman
            podman-compose
            mongodb-compass
          ];

          shellHook = ''
            echo "🚀 Development environment loaded"
            echo "Node: $(node --version)"
            echo "npm: $(npm --version)"
            echo ""
            # Create env for mongodb uri
            export DB_URI="mongodb://localhost:27017/helpaws"

            # Create registries config
            mkdir -p $HOME/.config/containers

            cat > $HOME/.config/containers/registries.conf << EOF
            [registries.search]
            registries = ['docker.io']

            [registries.insecure]
            registries = []

            [registries.block]
            registries = []
            EOF

              # Create policy.json
              cat > $HOME/.config/containers/policy.json << EOF
            {
              "default": [
                {
                  "type": "insecureAcceptAnything"
                }
              ],
              "transports": {
                "docker-daemon": {
                  "": [{"type": "insecureAcceptAnything"}]
                }
              }
            }
            EOF

              echo "Podman configured with Docker Hub and policy"
          '';
        };
      }
    );
}
