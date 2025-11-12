{
  description = "Project with intelligent skills and agents with claude code";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    skeletons.url = "github:netbrain/skeletons";  # ← Add this
  };

  outputs = { self, nixpkgs, flake-utils, skeletons }:  # ← Add skeletons here
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            skeletons.packages.${system}.intent-classifier  # ← Use this instead
            # Astro marketing site dependencies
            nodejs
            playwright-driver.browsers
            gh
            # Add more tools based on your stack
          ];

          shellHook = ''
            # Fix execute permissions on scripts (Nix templates don't preserve +x)
            if [ -d .claude ]; then
              find .claude -name "*.sh" -type f -exec chmod +x {} \; 2>/dev/null
            fi

            export PLAYWRIGHT_BROWSERS_PATH=${pkgs.playwright-driver.browsers}
            export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true

            echo "🤖 Claude Code environment with intelligent skills & agents"
            echo ""
            echo "Get started:"
            echo "  claude \"help me set up this project with skills and agents\""
            echo ""
          '';
        };
      });
}
