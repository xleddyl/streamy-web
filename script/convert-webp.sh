find . -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) | while read file
do
    dir=$(dirname "$file")
    filename=$(basename "$file" | cut -f 1 -d '.')
    cwebp -q 50 "$file" -o "$dir/$filename.webp"
    idx=$((idx + 1))
done
