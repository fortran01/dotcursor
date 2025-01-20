#!/bin/bash
set -e

echo "Verifying dotcursor installation..."
if ! command -v dotcursor &> /dev/null; then
    echo "❌ dotcursor command not found"
    exit 1
fi

echo "Creating test workspace..."
TEST_DIR="test_workspace"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

# Create test files
cat > main.ts << 'EOL'
function hello() {
  console.log("Hello");
}
const arrowFunc = () => {
  return "arrow";
};
class TestClass {
  method() {}
}
EOL

cat > script.py << 'EOL'
def python_func():
    pass
class PythonClass:
    pass
EOL

cat > style.css << 'EOL'
body { color: red; }
EOL

# Create files that should be ignored
mkdir -p temp
echo "log content" > test.log
echo "ignored content" > ignored.ts

# Create .gitignore
cat > .gitignore << 'EOL'
# Test gitignore
*.log
temp/
ignored.ts
EOL

echo "Running dotcursor..."
dotcursor

echo "Verifying output..."
if [ ! -f ".cursor.directory_structure.md" ]; then
    echo "❌ .cursor.directory_structure.md was not created"
    exit 1
fi

# Check if ignored files are excluded
if grep -q "test.log" .cursor.directory_structure.md; then
    echo "❌ Found ignored file test.log in output"
    exit 1
fi

if grep -q "ignored.ts" .cursor.directory_structure.md; then
    echo "❌ Found ignored file ignored.ts in output"
    exit 1
fi

# Check if expected files are included
if ! grep -q "main.ts" .cursor.directory_structure.md; then
    echo "❌ main.ts not found in output"
    exit 1
fi

if ! grep -q "script.py" .cursor.directory_structure.md; then
    echo "❌ script.py not found in output"
    exit 1
fi

if ! grep -q "style.css" .cursor.directory_structure.md; then
    echo "❌ style.css not found in output"
    exit 1
fi

echo "✅ All tests passed!" 