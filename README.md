# SPŠE Žatec Forum
Tento projekt jsem dělal na praxích, není určený k produkci a ani nebude k produkci použit. Jelikož je to projekt psaný pouze pro školu a nepočítá se tam s žádnými "db spammery", tak tam není ani captcha. 

# Funkce, které to obsahuje
  - Přihlašování
  - Registrace
  - Vytváření příspěvků
  - Likování příspěvků
  - Komentování příspěvků
  - Mazání příspěvků

# Jak to nainstalovat?
 Jednoduše stačí použít git clone na tuto repository.
   git clone https://github.com/DomiTG/spse-forum.git
 Pak musíme nainstalovat všechny potřebné dependencies:
   cd server
   npm i -d
   npx prisma migrate dev --name main
   npx prisma generate
   cd ..
   cd client
   npm i -d
 Nyní máme nainstalovaný jak client, tak i server, nyní je spustíme pomocí:
   npm run dev
 Tento příkaz musíte vykonat v "client" a "server" složce zvlášť a každý v jiném terminálu.

