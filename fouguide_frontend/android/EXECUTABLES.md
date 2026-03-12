`gradlew` must be executable

CI invokes the wrapper using:

- `./gradlew`

This requires the file mode bit to be set (+x).

If you see errors like:

- `bash: line 1: ./gradlew: No such file or directory`

but the file exists, it often means it is not executable.

Fix locally:

```sh
chmod +x gradlew
git add gradlew
git update-index --chmod=+x gradlew
git commit -m "Make gradlew executable"
```

Note: Some code generation / patch systems cannot change file mode bits; in that case, ensure your repository preserves the executable bit in git.
