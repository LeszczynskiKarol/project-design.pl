#!/bin/bash
# deploy-site.sh - Pełny deployment strony Astro na S3 + CloudFront

# Konfiguracja - ZMIEŃ NA SWOJE WARTOŚCI
S3_BUCKET="www.project-design.pl"  # Nazwa bucketu S3
CLOUDFRONT_ID="E1ZE3XVOTW45EO"  # Twoje CloudFront Distribution ID
REGION="eu-central-1"

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Funkcja do wyświetlania kroków
step() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
}

# Sprawdź wymagane narzędzia
check_requirements() {
    local missing=false
    
    if ! command -v aws &> /dev/null; then
        echo -e "${RED}❌ AWS CLI nie jest zainstalowane${NC}"
        missing=true
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm nie jest zainstalowane${NC}"
        missing=true
    fi
    
    if [ "$missing" = true ]; then
        exit 1
    fi
}

# Główny deployment
main() {
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════╗"
    echo "║     🚀 ASTRO SITE DEPLOYMENT 🚀       ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_requirements
    
    # 1. Sprawdź czy jesteśmy w głównym katalogu projektu
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ Uruchom skrypt z głównego katalogu projektu Astro${NC}"
        exit 1
    fi
    
    # 2. Instalacja zależności
    step "📦 KROK 1: Instalacja zależności"
    echo -e "${YELLOW}Instaluję pakiety npm...${NC}"
    npm install
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Błąd podczas instalacji zależności${NC}"
        exit 1
    fi
    
    # 3. Build projektu
    step "🔨 KROK 2: Budowanie projektu Astro"
    echo -e "${YELLOW}Buduję projekt...${NC}"
    npm run build
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Błąd podczas budowania projektu${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Build zakończony pomyślnie${NC}"
    
    # 4. Upload do S3
    step "☁️  KROK 3: Upload do S3"
    echo -e "${YELLOW}Wysyłam pliki do S3...${NC}"
    
    # Sync z odpowiednimi typami MIME
    aws s3 sync dist/ s3://${S3_BUCKET} \
        --delete \
        --cache-control "public, max-age=31536000" \
        --exclude "*.html" \
        --exclude "*.xml" \
        --exclude "*.json"
    
    # HTML z krótkim cache
    aws s3 sync dist/ s3://${S3_BUCKET} \
        --exclude "*" \
        --include "*.html" \
        --cache-control "public, max-age=300, must-revalidate" \
        --content-type "text/html"
    
    # XML i JSON
    aws s3 sync dist/ s3://${S3_BUCKET} \
        --exclude "*" \
        --include "*.xml" \
        --include "*.json" \
        --cache-control "public, max-age=3600"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Błąd podczas uploadu do S3${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Upload zakończony${NC}"
    
    # 5. Invalidacja CloudFront
    step "🔄 KROK 4: Invalidacja CloudFront"
    echo -e "${YELLOW}Tworzę invalidację CloudFront...${NC}"
    
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id ${CLOUDFRONT_ID} \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Błąd podczas tworzenia invalidacji${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Invalidacja utworzona: ${INVALIDATION_ID}${NC}"
    
    # 6. Czekaj na zakończenie invalidacji (opcjonalne)
    echo -e "${YELLOW}⏳ Czekam na zakończenie invalidacji...${NC}"
    aws cloudfront wait invalidation-completed \
        --distribution-id ${CLOUDFRONT_ID} \
        --id ${INVALIDATION_ID} &
    
    WAIT_PID=$!
    
    # Animacja ładowania
    spin='-\|/'
    i=0
    while kill -0 $WAIT_PID 2>/dev/null; do
        i=$(( (i+1) %4 ))
        printf "\r${spin:$i:1} Invalidacja w toku..."
        sleep .1
    done
    
    echo ""
    echo -e "${GREEN}✅ Invalidacja zakończona${NC}"
    
    # 7. Podsumowanie
    step "✨ DEPLOYMENT ZAKOŃCZONY!"
    
    echo -e "${GREEN}"
    echo "┌────────────────────────────────────────┐"
    echo "│         🎉 SUKCES! 🎉                  │"
    echo "├────────────────────────────────────────┤"
    echo "│ Twoja strona została wdrożona:        │"
    echo "│                                        │"
    echo "│ 🌐 https://d25wa8zx95wq3c.cloudfront.net │"
    echo "│                                        │"
    echo "│ Zmiany powinny być widoczne za:       │"
    echo "│ • 1-2 minuty (większość regionów)     │"
    echo "│ • do 15 minut (wszystkie edge)        │"
    echo "└────────────────────────────────────────┘"
    echo -e "${NC}"
    
    # Test API jeśli skonfigurowane
    if [ -f ".env" ] && grep -q "PUBLIC_REVIEWS_API_ENDPOINT" .env; then
        API_URL=$(grep PUBLIC_REVIEWS_API_ENDPOINT .env | cut -d '=' -f2)
        echo ""
        echo -e "${YELLOW}🔍 Testuję API Reviews...${NC}"
        
        if curl -s -o /dev/null -w "%{http_code}" "$API_URL" | grep -q "200"; then
            echo -e "${GREEN}✅ API Reviews działa poprawnie${NC}"
        else
            echo -e "${YELLOW}⚠️  API Reviews może wymagać konfiguracji${NC}"
        fi
    fi
}

# Uruchom główną funkcję
main

# Opcja: Otwórz stronę w przeglądarce
echo ""
read -p "Czy otworzyć stronę w przeglądarce? (t/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Tt]$ ]]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "https://www.project-design.pl"
    elif command -v open &> /dev/null; then
        open "https://www.project-design.pl"
    else
        echo "Otwórz w przeglądarce: https://www.project-design.pl"
    fi
fi