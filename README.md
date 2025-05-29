# Ascii jatek

## Hogyan kezdődött?
- Amikor elkezdtem, egy egyszerű buffer alapú rendszert képzeltem el, előre legenerált jelenetekkel (scene-ekkel) dolgozva. Mikor nekiálltam megírni a render-t, vagyis magát a frontend-et, jó párszor újra kellett kezdenem a semmiből az felmerülő nehézségek miatt.

- A legelején modulokra osztva fogtam neki a render-er megalkotásának. Magával a renderer-vel, mint rendszerrel, nem volt különösebb kihívás megbirkózni az internet segítségével, de futtatni annál inkább. Legalább három napig küszködtem a program futtatásával, mert a böngészők biztonsági funkciói nem igazán engedték a moduláris JavaScriptet. Mire teljesen feladtam a vanilla JS futtatását, jöhetett a B-terv: használjunk runtime-ot.

- Ezelőtt nem nagyon néztem körül a JavaScript világában zajló újdonságok után, bár volt némi elképzelésem a modern JS frameworkökről. Egy kis kutakodás után kellett döntenem, hogy mit használjak runtime-nak. Ott volt a Node.js, ami nagyon csábító, de nem éppen egy lightweight rendszer. Valami egyszerűbbre gondoltam, mert én csak a fájljaimat szerettem volna futtatni, nem pedig mindenféle csilli-villi frameworkre voltam kíváncsi. Így került képbe a Deno. Nagyon megtetszett: új.. volt, pont az, amire szükségem volt.

- Na, elkezdtem dolgozni vele. Egy mintát követve villámgyorsan összeraktam egy szervert, ami beágyazza a programomat a webböngészőbe. Működni működött, de nem igazán, mert akkor még nem tudtam, hogy vannak bizonyos MIME protokollok, vagy ki tudja, mik, amik elméletben a különböző fájlok importálását segítik elő, vagyis megcímkézik a böngészőnek a fájltípusokat, hogy tudja, mik azok. Ezen apróság miatt elpazaroltam egy napot: átírtam a fájljaimat TypeScriptre, bundle-oltam őket, és így tovább. Ez működött annyira, hogy fusson, de debugolni reménytelen volt. Mellőztem a moduláris JavaScriptet, és mindent egy fájlba sűrítettem. Ekkor jöttem rá, miért nem működött a moduláris JS. Gyorsan implementáltam a MIME típusokat, hogy a szerver megfelelően kiossza őket, és minden szuper lett.

- Eddigre sikerült lebetegednem, így csak néha-néha haladtam a projekten, de befejezni nem tudtam. A beadási határidőt teljesen elnéztem, valamiért az maradt meg, hogy hétvégére kell. Gondoltam, ha már így is lekéstem, akkor legalább fejezzem be, és legyen kész állapotban (ami akkor még nem igazán volt igaz). Valamiért kitaláltam, hogy ha már van egy runtime-om, használjuk ki, és csináljunk vele valamit. Jött az ihlet: az előre megtervezett sablonjáték helyett legyen egy véletlenszerűen generált világ, ahol lehet x és y tengelyen előre-hátra mozogni. Ez azzal járt, hogy át kellett vinnem az egész játéklogikát a backend-re, és meg kellett valósítanom a kliens és a szerver közötti kommunikációt. Egy kedves AI-val való beszélgetés során arraa következtetésre jutottam, hogy a legjobb, ha WebSocketet használok a rendszerek összekötésére, mert ez gyorsabb és egyszerűbb kommunikációt tesz lehetővé.

- A játék igencsak nagy kihívásnak bizonyult. Nem először próbáltam játékot tervezni, de JavaScriptben ez volt az első. A játékhoz kellett egy rendszer, ami kezeli az adatokat, így lett egy ECS. Emellett szükség volt egy chunk-rendszerre, ami felosztja és generálja a chunkokat. Továbbá fel kellett turbóznom a kommunikációt a szerver és a kliens között, hogy rendesen tudja küldeni a különböző adatokat, legyen szó chunkokról, játékosinfókról vagy akár csak egy képernyőméret-változásról.

## Futatattás

- Installálni a Deno runtime-ot

- Klonozd a repo-t

- "Deno task start" parancsal futatni is tudod a local szervert. Az elindulás után localhost:8000 -en meggy a weblap és ha minden fain akkor WASD-vel lehet mozogni. És nagyon remélem nem csak az én gépemen nyügszik (:

