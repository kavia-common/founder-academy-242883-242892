# Minimal helper Dockerfile for CI environments that run Gradle checks inside Docker.
# Ensures `./gradlew` exists at the working directory (`/app`).
#
# This is NOT required for Expo runtime; it is a CI convenience.

FROM node:20-bullseye

WORKDIR /app

# Copy repo contents into image
COPY . .

# Ensure wrapper scripts are present (they are committed) and attempt to set executable bit.
# Note: executable bit may be ignored by some CI patch systems, so we enforce it here.
RUN chmod +x /app/gradlew || true \
  && chmod +x /app/android/gradlew || true

# No default command; CI can override.
CMD ["bash"]
