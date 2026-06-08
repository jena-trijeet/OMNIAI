import re
import sys

with open("omniai-admin/dashboard.html", "r", encoding="utf-8") as f:
    content = f.read()

# Find the script tag containing adminDashboard
# Let's search for '<script>' and extract the block.
# There are multiple scripts, but the main one defines adminDashboard.
scripts = re.findall(r'<script>(.*?)</script>', content, re.DOTALL)

target_script = None
for s in scripts:
    if "function adminDashboard" in s:
        target_script = s
        break

if not target_script:
    print("Could not find adminDashboard script tag!")
    sys.exit(1)

# Write to a temp js file so we can run node syntax check on it
with open("omniai/scratch/temp_check.js", "w", encoding="utf-8") as f:
    f.write(target_script)

print("Extracted script. Running node syntax check...")
import subprocess
result = subprocess.run(["node", "-c", "omniai/scratch/temp_check.js"], capture_output=True, text=True)

if result.returncode != 0:
    print("SYNTAX ERROR FOUND:")
    print(result.stderr)
    sys.exit(1)
else:
    print("No syntax errors found in dashboard.html javascript!")
