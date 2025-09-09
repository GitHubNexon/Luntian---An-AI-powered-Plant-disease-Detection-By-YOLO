import subprocess

def run_command(command, cwd=None):
    try:
        print(f"Running: {command}")
        result = subprocess.run(command, shell=True, cwd=cwd, check=True, text=True)
        print("✔️ Success\n")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}\n")

# Step 1: Nginx commands
run_command("sudo nginx -t")
run_command("sudo systemctl restart nginx")

# Step 2: Start Node.js app with PM2
node_project_path = "/home/ubuntu-pi/PROJECTS/Luntian---An-AI-powered-Plant-disease-Detection-By-YOLO/server"
run_command("pm2 start app.js --name luntian", cwd=node_project_path)

# Step 3: Start FastAPI app with PM2
fastapi_project_path = "/home/ubuntu-pi/PROJECTS/Luntian---An-AI-powered-Plant-disease-Detection-By-YOLO/sensor"
fastapi_command = (
    "pm2 start uvicorn --name fastapi-sensor --interpreter ./venv/bin/python3 -- "
    "app:app --reload --host 0.0.0.0 --port 8000 --timeout-keep-alive 60"
)
run_command(fastapi_command, cwd=fastapi_project_path)

# Step 4: PM2 startup and save
run_command("pm2 startup")
run_command("pm2 save")
run_command("pm2 list")

#python3 run.py
