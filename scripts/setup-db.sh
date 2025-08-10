#!/bin/bash

# =============================================================================
# Database Setup Script for Finance Practice Application
# =============================================================================

set -euo pipefail  # Exit on error, undefined variables, pipe failures

# Color definitions for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
readonly COMPOSE_FILE="$PROJECT_ROOT/docker-compose.yml"

# Function definitions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is required but not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is required but not installed. Please install Docker Compose first."
        exit 1
    fi
    
    log_success "Requirements check passed"
}

cleanup_existing_containers() {
    log_info "Cleaning up existing containers..."
    
    # Stop and remove existing containers
    docker-compose -f "$COMPOSE_FILE" down --volumes --remove-orphans 2>/dev/null || true
    
    # Remove specific containers if they exist
    for container in finance-practice-db finance-practice-flyway finance-practice-redis finance-practice-pgadmin; do
        if docker ps -a --format '{{.Names}}' | grep -q "^${container}$"; then
            log_info "Removing container: $container"
            docker rm -f "$container" 2>/dev/null || true
        fi
    done
    
    log_success "Cleanup completed"
}

start_database() {
    log_info "Starting PostgreSQL database..."
    
    # Start PostgreSQL container
    docker-compose -f "$COMPOSE_FILE" up -d postgres
    
    # Wait for database to be ready
    log_info "Waiting for database to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose -f "$COMPOSE_FILE" exec postgres pg_isready -U finance_user -d finance_practice_dev &>/dev/null; then
            log_success "Database is ready"
            break
        fi
        
        log_info "Attempt $attempt/$max_attempts: Database not ready yet, waiting..."
        sleep 2
        ((attempt++))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        log_error "Database failed to start within expected time"
        exit 1
    fi
}

run_migrations() {
    log_info "Running database migrations with Flyway..."
    
    # Run Flyway migrations
    docker-compose -f "$COMPOSE_FILE" up flyway
    
    # Check migration status
    if [ $? -eq 0 ]; then
        log_success "Database migrations completed successfully"
    else
        log_error "Database migrations failed"
        exit 1
    fi
}

start_additional_services() {
    log_info "Starting additional services (Redis, pgAdmin)..."
    
    # Start Redis
    docker-compose -f "$COMPOSE_FILE" up -d redis
    
    # Start pgAdmin (optional)
    if [ "${SKIP_PGADMIN:-false}" != "true" ]; then
        docker-compose -f "$COMPOSE_FILE" up -d pgadmin
        log_info "pgAdmin will be available at http://localhost:5050"
        log_info "Default credentials: admin@finance-practice.local / admin123"
    else
        log_info "Skipping pgAdmin startup (SKIP_PGADMIN=true)"
    fi
    
    log_success "Additional services started"
}

show_connection_info() {
    log_info "Database connection information:"
    echo
    echo "  Host: localhost"
    echo "  Port: 5432"
    echo "  Database: finance_practice_dev"
    echo "  Username: finance_user"
    echo "  Password: finance_password"
    echo
    log_info "Redis connection information:"
    echo "  Host: localhost"
    echo "  Port: 6379"
    echo
    if [ "${SKIP_PGADMIN:-false}" != "true" ]; then
        log_info "pgAdmin access:"
        echo "  URL: http://localhost:5050"
        echo "  Email: admin@finance-practice.local"
        echo "  Password: admin123"
        echo
    fi
}

check_services_health() {
    log_info "Checking service health..."
    
    # Check PostgreSQL health
    if docker-compose -f "$COMPOSE_FILE" exec postgres pg_isready -U finance_user -d finance_practice_dev &>/dev/null; then
        log_success "PostgreSQL is healthy"
    else
        log_warning "PostgreSQL health check failed"
    fi
    
    # Check Redis health
    if docker-compose -f "$COMPOSE_FILE" exec redis redis-cli ping &>/dev/null; then
        log_success "Redis is healthy"  
    else
        log_warning "Redis health check failed"
    fi
}

show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo
    echo "Options:"
    echo "  -h, --help           Show this help message"
    echo "  -c, --clean          Clean up existing containers before setup"
    echo "  -s, --skip-pgadmin   Skip pgAdmin setup"
    echo "  --migrations-only    Run only migrations (assumes DB is already running)"
    echo
    echo "Environment Variables:"
    echo "  SKIP_PGADMIN=true    Skip pgAdmin startup"
    echo
    echo "Examples:"
    echo "  $0                   # Standard setup"
    echo "  $0 --clean           # Clean setup from scratch"
    echo "  $0 --skip-pgadmin    # Setup without pgAdmin"
    echo "  $0 --migrations-only # Run migrations only"
}

main() {
    local clean_setup=false
    local migrations_only=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -c|--clean)
                clean_setup=true
                shift
                ;;
            -s|--skip-pgadmin)
                export SKIP_PGADMIN=true
                shift
                ;;
            --migrations-only)
                migrations_only=true
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    log_info "Starting Finance Practice Database Setup"
    echo "========================================"
    
    # Check requirements
    check_requirements
    
    # Change to project root directory
    cd "$PROJECT_ROOT"
    
    if [ "$migrations_only" = true ]; then
        log_info "Running migrations only..."
        run_migrations
    else
        # Clean up if requested
        if [ "$clean_setup" = true ]; then
            cleanup_existing_containers
        fi
        
        # Setup database
        start_database
        run_migrations
        start_additional_services
        
        # Health checks
        check_services_health
    fi
    
    # Show connection info
    show_connection_info
    
    log_success "Database setup completed successfully!"
    log_info "You can now start the backend API with: npm run dev"
}

# Handle script interruption
trap 'log_error "Setup interrupted"; exit 1' INT TERM

# Run main function with all arguments
main "$@"