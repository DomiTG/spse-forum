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
 - Jednoduše stačí použít git clone na tuto repository.
   - git clone https://github.com/DomiTG/spse-forum.git
 - Pak musíme nainstalovat všechny potřebné dependencies:
   - cd server
   - npm i -d
   - npx prisma migrate dev --name main
   - npx prisma generate
   - cd ..
   - cd client
   - npm i -d
 - Nyní máme nainstalovaný jak client, tak i server, nyní je spustíme pomocí:
   - npm run dev
 - Tento příkaz musíte vykonat v "client" a "server" složce zvlášť a každý v jiném terminálu.

<img width="1440" alt="Screenshot 2024-01-27 at 20 22 49" src="https://github.com/DomiTG/spse-forum/assets/81680504/02138988-db84-440a-bfd1-65d257ae7000">
<img width="1440" alt="Screenshot 2024-01-27 at 20 23 04" src="https://github.com/DomiTG/spse-forum/assets/81680504/748513a1-57b9-40c4-8571-fa04b388056c">
<img width="735" alt="Screenshot 2024-01-27 at 20 23 22" src="https://github.com/DomiTG/spse-forum/assets/81680504/29d887cd-9f1c-4712-b3c0-386ce2af78d3">
<img width="153" alt="Screenshot 2024-01-27 at 20 23 39" src="https://github.com/DomiTG/spse-forum/assets/81680504/3cc8f8f4-914d-4a5f-a403-3ab3939cb7fb">
