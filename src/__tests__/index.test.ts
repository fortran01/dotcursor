import { describe, expect, test, beforeAll, afterAll } from "bun:test";
import { join } from "path";
import { mkdir, writeFile, rm } from "fs/promises";
import type { FileInfo, DirectoryInfo } from "../index";

// Mock test directory structure
const TEST_DIR = "test_workspace";
const TEST_FILES = {
  "main.ts": `
function hello() {
  console.log("Hello");
}
const arrowFunc = () => {
  return "arrow";
};
class TestClass {
  method() {}
}`,
  "script.py": `
def python_func():
    pass
class PythonClass:
    pass`,
  "style.css": "body { color: red; }",
};

describe("dotcursor", () => {
  beforeAll(async () => {
    try {
      // Clean up any existing test directory
      await rm(TEST_DIR, { recursive: true, force: true });
      // Create test directory structure
      await mkdir(TEST_DIR, { recursive: true });
      // Create test files
      for (const [filename, content] of Object.entries(TEST_FILES)) {
        await writeFile(join(TEST_DIR, filename), content, 'utf-8');
      }
      // Create files that should be ignored
      await mkdir(join(TEST_DIR, 'temp'), { recursive: true });
      await writeFile(join(TEST_DIR, 'test.log'), 'log content', 'utf-8');
      await writeFile(join(TEST_DIR, 'ignored.ts'), 'ignored content', 'utf-8');
      // Create .gitignore file
      await writeFile(join(TEST_DIR, '.gitignore'), `
# Test gitignore
*.log
temp/
ignored.ts`, 'utf-8');
    } catch (error) {
      console.error('Error in test setup:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      // Clean up test directory
      await rm(TEST_DIR, { recursive: true, force: true });
    } catch (error) {
      console.error('Error in test cleanup:', error);
    }
  });

  // Test file type detection
  test("detectFileType", async () => {
    const { detectFileType } = await import("../index");
    expect(await detectFileType("test.ts")).toBe("TypeScript");
    expect(await detectFileType("test.py")).toBe("Python");
    expect(await detectFileType("test.unknown")).toBe("Unknown");
  });

  // Test function extraction
  test("extractFunctions", async () => {
    const { extractFunctions } = await import("../index");
    
    const tsContent = TEST_FILES["main.ts"];
    const tsFunctions = await extractFunctions(tsContent, "TypeScript");
    expect(tsFunctions).toContain("hello");
    expect(tsFunctions).toContain("arrowFunc");
    expect(tsFunctions).toContain("TestClass");

    const pyContent = TEST_FILES["script.py"];
    const pyFunctions = await extractFunctions(pyContent, "Python");
    expect(pyFunctions).toContain("python_func");
    expect(pyFunctions).toContain("PythonClass");
  });

  // Test directory analysis
  test("analyzeDirectory", async () => {
    const { analyzeDirectory } = await import("../index");
    const config = { excludeDirs: [], watchMode: false, gitignorePatterns: [] };
    
    const info = await analyzeDirectory(TEST_DIR, config);
    
    // Debug log
    console.log('Files found in first test:', info.files.map(f => f.path));
    
    // Should find all non-hidden files
    expect(info.files).toHaveLength(3); // main.ts, script.py, style.css
    expect(info.files.some((f: FileInfo) => f.path.includes("main.ts"))).toBe(true);
    expect(info.files.some((f: FileInfo) => f.path.includes("script.py"))).toBe(true);
    expect(info.files.some((f: FileInfo) => f.path.includes("style.css"))).toBe(true);
  });

  // Test directory analysis with gitignore patterns
  test("analyzeDirectory respects gitignore patterns", async () => {
    const { analyzeDirectory } = await import("../index");
    // Use proper gitignore patterns
    const gitignorePatterns = ['*.log', 'temp/', 'ignored.ts'];
    const config = { excludeDirs: [], watchMode: false, gitignorePatterns };
    
    const info = await analyzeDirectory(TEST_DIR, config);
    
    // Should only find non-ignored files
    expect(info.files).toHaveLength(3); // main.ts, script.py, style.css
    expect(info.files.some((f: FileInfo) => f.path.includes("test.log"))).toBe(false);
    expect(info.files.some((f: FileInfo) => f.path.includes("ignored.ts"))).toBe(false);
    expect(info.subdirectories.some((d: DirectoryInfo) => d.path.includes("temp"))).toBe(false);
    
    // Verify the correct files are present
    expect(info.files.some((f: FileInfo) => f.path.includes("main.ts"))).toBe(true);
    expect(info.files.some((f: FileInfo) => f.path.includes("script.py"))).toBe(true);
    expect(info.files.some((f: FileInfo) => f.path.includes("style.css"))).toBe(true);
  });

  // Test markdown generation
  test("generateMarkdown", async () => {
    const { generateMarkdown } = await import("../index");
    const mockInfo: DirectoryInfo = {
      path: "test",
      files: [{
        path: "test/file.ts",
        size: 1024,
        type: "TypeScript",
        functions: ["testFunc"]
      }],
      subdirectories: []
    };

    const markdown = generateMarkdown(mockInfo);
    expect(markdown).toContain("## 📁 test");
    expect(markdown).toContain("📄 `test/file.ts`");
    expect(markdown).toContain("Type: TypeScript");
    expect(markdown).toContain("`testFunc`");
  });
}); 