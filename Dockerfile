FROM node:20-bookworm

WORKDIR /app

# Install system dependencies (if necessary)
RUN apt-get update && apt-get install -y \
  build-essential \
  zlib1g-dev \
  libncurses5-dev \
  libgdbm-dev \
  libnss3-dev \
  libssl-dev \
  libreadline-dev \
  libffi-dev \
  libsqlite3-dev \
  wget \
  libbz2-dev \
  python3 \
  python3-pip \
  python3-venv

# Set up Python environment
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"
RUN pip install --upgrade pip
RUN pip install uvicorn fastapi

# Command to run the application
CMD ["sh", "-c", "uvicorn server:app --host 0.0.0.0 --port 8000 --reload"]
