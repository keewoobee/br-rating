
import json
import re

# Read the file
with open('src/data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the array content
match = re.search(r'export const menuData: MenuItem\[\] = (\[.*\]);', content, re.DOTALL)
if not match:
    print("Could not find menuData array")
    exit(1)

data_str = match.group(1)
# This is a bit hacky, but should work for a simple JSON-like structure
# We need to remove the trailing comma if it exists before the closing bracket
data_str = re.sub(r',\s*\]', ']', data_str)
data = json.loads(data_str)

id_counts = {}
name_counts = {}
tag_issues = []

for item in data:
    id_counts[item.get('id')] = id_counts.get(item.get('id'), 0) + 1
    name_counts[item.get('name')] = name_counts.get(item.get('name'), 0) + 1
    
    tags = item.get('tags', [])
    years = [t for t in tags if '년' in t or re.match(r'20\d\d', t)]
    if len(years) > 1:
        tag_issues.append(f"Item ID {item.get('id')} ({item.get('name')}) has multiple year tags: {years}")

print("--- Analysis Report ---")
print("Duplicate IDs:", [id for id, count in id_counts.items() if count > 1])
print("Duplicate Names:", [name for name, count in name_counts.items() if count > 1])
print("Tag Issues (first 5):", tag_issues[:5])
