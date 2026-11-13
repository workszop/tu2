// ─── Translations ───
// Flat dictionary: T[lang][key]. English page content lives in the HTML itself
// (elements marked with data-i18n="key"), so T.en only holds strings that are
// rendered by site.js (drawer, footer, cookie banner). T.pl holds everything.
// Lookup order in t(key): T[lang] → T.en → text captured from the HTML.

const FORBES_URL = 'https://www.forbes.com/sites/bernardmarr/2020/08/14/how-to-identify-the-best-ai-opportunities-for-your-business--in-2-simple-steps/?';

const T = {
  en: {
    'chrome.skip': 'Skip to content',
    'chrome.menuOpen': 'Open navigation',
    'chrome.menuClose': 'Close navigation',
    'chrome.language': 'Language',
    'chrome.siteNav': 'Site',
    'footer.tagline': 'High-end ultrasound scanners for veterinary practices.',
    'footer.address': 'Lublin, Poland',
    'footer.hours': 'Monday–Friday, 9 am–5 pm',
    'footer.connect': 'Connect with us',
    'footer.copyright': 'Copyright © 2021 vet-eye - All Rights Reserved.',
    'cookie.title': 'This website uses cookies.',
    'cookie.text': 'We use cookies to analyze website traffic and optimize your website experience. If you accept, your data will be aggregated with all other user data.',
    'cookie.decline': 'Decline',
    'cookie.accept': 'Accept',
  },

  pl: {
    // ─── Shared chrome ───
    'chrome.skip': 'Przejdź do treści',
    'chrome.menuOpen': 'Otwórz menu',
    'chrome.menuClose': 'Zamknij menu',
    'chrome.language': 'Język',
    'chrome.siteNav': 'Strona',
    'nav.home': 'Start',
    'nav.products': 'Produkty',
    'nav.ultrasonography': 'Ultrasonografia',
    'nav.technology': 'Technologia',
    'nav.company': 'Firma',
    'nav.contact': 'Kontakt',
    'footer.address': 'Lublin, Polska',
    'footer.hours': 'Poniedziałek – piątek: 9:00–17:00',
    'footer.connect': 'Znajdź nas w sieci',
    'footer.copyright': 'Copyright © 2021 vet-eye – Wszelkie prawa zastrzeżone.',
    'cta.quote': 'Poproś o wycenę',
    'img.dogUltrasound': 'Badanie USG brzucha psa przy wsparciu asystentki',
    'img.probe': 'Dłoń w rękawiczce przykłada głowicę USG do wygolonego brzucha psa',
    'img.scanRoom': 'Gabinet weterynaryjny z aparatem USG i wyściełanym stołem',
    'cta.title': 'Dobierzemy ultrasonograf do Twojej lecznicy',
    'cta.text': 'Napisz, jakie zwierzęta badasz i jak pracujesz. Odpowiadamy w ciągu 48 godzin.',
    'footer.tagline': 'Wysokiej klasy ultrasonografy dla lecznic weterynaryjnych.',
    'stats.sites': 'lokalizacje',
    'stats.employees': 'pracowników',
    'stats.clinics': 'lecznic weterynaryjnych codziennie korzysta z naszego sprzętu',
    'cookie.title': 'Ta strona używa plików cookie.',
    'cookie.text': 'Używamy plików cookie, żeby analizować ruch na stronie i dopasowywać ją do Twoich potrzeb. Jeśli zaakceptujesz pliki cookie, Twoje dane zostaną połączone z danymi pozostałych użytkowników.',
    'cookie.decline': 'Odrzuć',
    'cookie.accept': 'Akceptuj',

    // ─── Home ───
    'home.metaTitle': 'vet-eye | Ultrasonografy weterynaryjne',
    'home.metaDesc': 'vet-eye projektuje i produkuje wysokiej klasy ultrasonografy dla lecznic weterynaryjnych. Codziennie pracuje na nich ponad 10 000 lecznic.',
    'home.title': 'Liczy się to, co w środku.',
    'home.intro': 'Ultrasonografy vet-eye pokazują lekarzowi weterynarii to, czego nie widać na stole zabiegowym. Sami je projektujemy i produkujemy, a codziennie pracuje na nich ponad 10 000 lecznic.',
    'home.eyebrow': 'USG weterynaryjne',
    'home.productsTitle': 'Ultrasonograf dopasowany do Twojej pracy',
    'home.statsTitle': 'Sprzęt, na którym lecznice pracują codziennie',
    'tile.proKey': 'Nasz najostrzejszy obraz, gotowy do badania w niecałe 25 sekund',
    'tile.portable': 'Obraz z najwyższej półki, który zabierzesz wszędzie',
    'tile.pro70': 'W pełni cyfrowy, skonfigurowany pod Twoją lecznicę',
    'home.ctaProducts': 'Zobacz produkty',

    // ─── Products ───
    'products.metaTitle': 'Produkty | vet-eye',
    'products.metaDesc': 'Ultrasonografy weterynaryjne: vet pro-key 75, vet portable 15 i vet pro 70.',
    'products.title': 'Ultrasonografy stworzone dla lecznic weterynaryjnych',
    'products.lead': 'Trzy przenośne aparaty i jeden cel: obraz, któremu możesz zaufać, gdziekolwiek jest pacjent.',
    'products.proKey': `<p><strong>vet pro-key 75</strong> daje najostrzejszy obraz w naszej ofercie, a przy tym jest trwały, niezawodny i łatwy do utrzymania w czystości.</p>
<ul>
  <li>Pracuje na opcjonalnym stojaku albo bez niego</li>
  <li>Szerokokątny wyświetlacz z powłoką antyrefleksyjną jest czytelny przy każdym oświetleniu</li>
  <li>Najczęściej używane funkcje masz zawsze pod ręką, a gładzik z przyciskiem wyboru ułatwia precyzyjną nawigację</li>
  <li>Niskoprofilowe przyciski z wyczuwalnym klikiem łatwo wytrzeć do czysta</li>
  <li>Silikonowa klawiatura uszczelniona aż do krawędzi nie przepuszcza płynów i łatwo ją zdezynfekować</li>
  <li>Gotowy do badania w mniej niż 25 sekund od zimnego startu</li>
</ul>`,
    'products.portable': '<p><strong>vet portable 15</strong> to obraz z najwyższej półki w aparacie, który łatwo zabrać na każdą wizytę. Zaprojektowaliśmy go z myślą o jak najwyższej skuteczności diagnostycznej, gdziekolwiek jest pacjent.</p>',
    'products.pro70': '<p><strong>vet pro 70</strong> jest przenośny, w pełni cyfrowy i sterowany programowo, więc dopasujesz go do swojej lecznicy. Wybierasz konfigurację i zestaw funkcji, a aparat wyświetla obrazy wysokiej rozdzielczości w czasie rzeczywistym.</p>',

    // ─── Ultrasonography ───
    'ultrasonography.metaTitle': 'Ultrasonografia | vet-eye',
    'ultrasonography.metaDesc': 'Czym jest USG w weterynarii, do czego służy i czy opłaca się lecznicy.',
    'ultrasonography.title': 'Co pokazuje USG i dlaczego się opłaca',
    'ultrasonography.body': `<p>Badanie ultrasonograficzne (USG, sonografia) polega na skierowaniu na wybraną część ciała fal dźwiękowych o wysokiej częstotliwości, dzięki czemu powstaje obraz wnętrza ciała. W badaniu USG nie używa się promieniowania jonizującego (rentgenowskiego). Obraz powstaje w czasie rzeczywistym, więc widać na nim budowę i ruch narządów wewnętrznych, a także krew płynącą w naczyniach. Badanie można wykonać przy minimalnym unieruchomieniu zwierzęcia lub po lekkiej sedacji.</p>
<h3>Co widać w USG jamy brzusznej</h3>
<p>USG jamy brzusznej pozwala ocenić:</p>
<ul>
  <li>nerki</li>
  <li>wątrobę</li>
  <li>pęcherzyk żółciowy</li>
  <li>trzustkę</li>
  <li>śledzionę</li>
  <li>naczynia krwionośne jamy brzusznej</li>
</ul>
<p>Pod kontrolą USG lekarze weterynarii wprowadzają też cienką igłę w zmienioną chorobowo tkankę, żeby pobrać materiał do biopsji.</p>
<h3>Co pomaga rozpoznać</h3>
<ul>
  <li>ból brzucha</li>
  <li>zapalenie trzustki</li>
  <li>powiększenie narządu jamy brzusznej</li>
  <li>kamienie w nerkach lub pęcherzu moczowym</li>
  <li>zespolenia wrotno-oboczne</li>
</ul>
<p>W biopsji igłowej pobiera się z narządu próbkę komórek do badań laboratoryjnych.</p>`,
    'ultrasonography.learnTitle': 'Zasada działania',
    'ultrasonography.learnText': 'Na stronie o technologii wyjaśniamy, jak działa obrazowanie ultrasonograficzne.',
    'ultrasonography.learnButton': 'Czytaj o technologii',
    'ultrasonography.worthTitle': 'Czy USG się opłaca?',
    'ultrasonography.worthBody': `<p>W ostatnich latach USG stało się w weterynarii standardem. Lecznice inwestują w ultrasonograf najczęściej z tych powodów:</p>
<ul>
  <li>postęp technologiczny</li>
  <li>ceny przystępne dla lekarzy i dla właścicieli zwierząt</li>
  <li>niższe koszty diagnostyki</li>
  <li>nowe zastosowania diagnostyczne i nisze specjalistyczne</li>
  <li>więcej pacjentów ze skierowań</li>
</ul>
<h3>Jak rozwinęła się technologia</h3>
<p>Dzisiejsze ultrasonografy weterynaryjne są łatwiejsze w obsłudze, mają wyższą rozdzielczość i lepszy kontrast obrazu. Można na nich wiarygodnie uwidocznić mniejsze narządy i dostrzec subtelniejsze zmiany, a diagnozę postawić szybciej i łatwiej, niż było to do pomyślenia jeszcze 5 lat temu. Automatyczna optymalizacja obrazu zdejmuje z lekarzy i techników weterynarii żmudne ustawianie aparatu, więc mogą skupić się na szybszej i trafniejszej diagnozie.</p>
<h3>Ile kosztuje ultrasonograf</h3>
<p>Ultrasonograf weterynaryjny z podstawowym zestawem głowic kosztuje średnio od 18 000 do 30 000 dolarów. Cena zależy od tego, czy aparat jest przenośny, czy stacjonarny, od liczby i rodzaju głowic oraz od dodatkowych funkcji oprogramowania, na przykład wbudowanych modułów, które podpowiadają na bieżąco w trakcie badania.</p>
<p>To duży wydatek i wielu lekarzy się przed nim waha. Najnowsze dane Uniwersytetu Illinois i American Animal Hospital Association (AAHA) pokazują jednak, że w większości lecznic USG od razu zaczyna przynosić przychód.</p>
<h3>Ile przynosi badanie</h3>
<p>Stawka za badanie USG zależy od konkretnej procedury, ale nawet przy ostrożnych szacunkach większość lecznic zaczyna na nim zarabiać od razu. AAHA przeanalizowała dane z 2015 roku i wyliczyła, że średnia cena badania jamy brzusznej wynosi:</p>
<ul>
  <li>275 dolarów w dużych miastach</li>
  <li>231 dolarów w miasteczkach</li>
  <li>121 dolarów na terenach wiejskich</li>
</ul>
<p>Nowsze badanie Wydziału Medycyny Weterynaryjnej Uniwersytetu Illinois w Urbana-Champaign szacuje średni koszt badania jamy brzusznej w latach 2016–2017 na 260 dolarów. Kwota ta nie obejmuje przychodów z innych badań USG, takich jak diagnostyka ciąży, echokardiografia czy cystocenteza.</p>
<p>Przy takim koszcie sprzętu inwestycja zwraca się zwykle przy 5–6 badaniach miesięcznie.</p>
<h3>Rozwój lecznicy</h3>
<p><strong>Więcej klientów z polecenia</strong><br>Właściciele zwierząt ufają lekarzowi, który pracuje najnowocześniejszymi metodami. USG ma tyle zastosowań, że okazji do wyjaśnienia, jak działa i co daje ich zwierzęciu, nie zabraknie. Zadowoleni klienci polecają lecznicę znajomym, rodzinie i współpracownikom.</p>
<p><strong>Wyspecjalizowane nisze</strong><br>USG jest niezbędne w opiece nad zwierzętami w ogrodach zoologicznych, ssakami morskimi, końmi i przeżuwaczami. Z przenośnym ultrasonografem możesz oferować usługi także w tych niszach.</p>
<h3>Wniosek</h3>
<p>Większości lekarzy weterynarii USG od razu podnosi przychody i nawet przy ostrożnych szacunkach zakup ultrasonografu to rozsądna inwestycja. Lecznica, która oferuje USG, zyskuje nowe źródła przychodu, a do tego lojalnych klientów i polecenia.</p>`,

    // ─── Technology ───
    'technology.metaTitle': 'Technologia | vet-eye',
    'technology.metaDesc': 'Jak działa ultrasonografia: prezentacja B, głowice, ograniczenia metody i typowe badania.',
    'technology.title': 'Technologia',
    'technology.articleTitle': 'Jak działa ultrasonografia',
    'technology.body': `<p>Ultrasonografia to druga najczęściej stosowana metoda obrazowania w praktyce weterynaryjnej. Wykorzystuje fale ultradźwiękowe o częstotliwości 1,5–15 megaherców (MHz), a obraz struktur ciała powstaje na podstawie układu ech odbitych od badanych tkanek i narządów.</p>
<h3>Jak powstaje obraz</h3>
<p>Obraz można wyświetlać w kilku formatach. Najbardziej znany, i to on daje właściwy obraz anatomiczny, to prezentacja B (B-mode) w skali szarości. Wiązkę dźwięku wytwarza głowica przyłożona do ciała zwierzęcia i sprzężona z nim akustycznie za pomocą żelu. Głowica wysyła w głąb ciała ultrakrótki impuls dźwięku, po czym przełącza się w tryb odbioru. Echa powstają tam, gdzie wiązka zmienia prędkość, czyli przy przejściu z tkanki o jednej gęstości do tkanki o innej gęstości, nawet jeśli zmiana zachodzi na poziomie niemal mikroskopowym. Im większa zmiana prędkości, tym silniejsze echo. Niewielka część tych ech wraca do głowicy, która zamienia ich energię z powrotem na impulsy elektryczne rejestrowane przez komputer ultrasonografu. Zapisywane są: siła echa, czas, po jakim echo wróciło od wysłania impulsu, oraz kierunek wysłanej wiązki. Z informacji z wielu ech aparat tworzy obraz, który odpowiada wyglądowi tkanek przeciętych w tej samej płaszczyźnie na preparacie anatomicznym.</p>
<h3>Obraz w czasie rzeczywistym</h3>
<p>W nowoczesnych aparatach wiązka przemiata ciało wiele razy na sekundę, dzięki czemu powstaje dynamiczny obraz w czasie rzeczywistym, zmieniający się wraz z ruchem głowicy. Taki obraz łatwiej zinterpretować, a badający może prowadzić głowicę tak długo, aż uzyska zadowalający obraz. Obraz można wtedy zamrozić i zapisać w formacie cyfrowym, także jako krótki fragment badania w czasie rzeczywistym. Podobnie jak w radiografii i innych systemach obrazowania medycznego, przyjętym i uznawanym prawnie formatem cyfrowych obrazów USG jest standard DICOM III.</p>
<h3>Ograniczenia metody</h3>
<p>Ultrasonografią nie da się badać tkanek wypełnionych gazem ani tkanek kostnych. Na granicy tkanki miękkiej i gazu wiązka odbija się w całości, a na granicy tkanki miękkiej i kości jest pochłaniana. Gaz i kość rzucają też „cień” na narządy położone za nimi. Gazy jelitowe mogą utrudniać obrazowanie sąsiednich narządów jamy brzusznej, a serce trzeba obrazować z takich miejsc, w których wiązka nie musi przechodzić przez płuca.</p>
<p>Ograniczona jest również głębokość, na jaką można zbadać tkanki. Większość aparatów pokazuje tkanki do głębokości ok. 24 cm, ale obraz bywa tam mocno zaszumiony. Dzieje się tak, bo większość ech nie wraca prosto do głowicy, tylko odbija się w innym kierunku. Na głębokości 24 cm wiązka traci tyle energii, że echa są zbyt słabe, żeby aparat odróżnił je od tła szumów elektronicznych. Poza tym część ech, które nie odbiły się bezpośrednio, może wrócić do głowicy po odbiciu od tkanki leżącej poza torem wiązki. Takie echa wracają później i są wyświetlane w fałszywym miejscu, co dodaje szumu do obrazu. Głowice o niskiej częstotliwości sięgają głębiej niż głowice o wysokiej częstotliwości, ale mają mniejszą rozdzielczość. W ośrodkach płynnych, takich jak pęcherz moczowy, wiązka traci znacznie mniej energii, więc jeśli przechodzi przez taki ośrodek, maksymalną głębokość badania można zwiększyć kosztem rozdzielczości czasowej.</p>
<h3>Typowe badania</h3>
<p>USG pozwala ocenić większość tkanek miękkich, w tym mięśnie, ścięgna i więzadła, ale u małych zwierząt nadal najczęściej bada się serce i narządy jamy brzusznej. Struktury jamy brzusznej należy oceniać systematycznie. Każdy badający wypracowuje własny schemat pełnej oceny jamy brzusznej, a systematyczność daje pewność, że żadna struktura nie zostanie pominięta. Dawniej narządy takie jak nadnercza i trzustka były widoczne tylko wtedy, gdy były zmienione chorobowo i powiększone. Nowoczesny aparat w rękach doświadczonego badającego daje jednak obrazy takiej jakości, że prawidłowe nadnercza, trzustkę i węzły chłonne widać rutynowo nawet u dużych psów.</p>`,
    'technology.linksTitle': 'Więcej na ten temat',
    'technology.ctaTitle': 'W stronę klinicznych zastosowań sztucznej inteligencji w obrazowaniu ultrasonograficznym',
    'technology.ctaButton': 'Przeczytaj artykuł',

    // ─── Company ───
    'company.metaTitle': 'Firma | vet-eye',
    'company.metaDesc': 'O vet-eye: kim jesteśmy, nasze wartości, firma w liczbach, relacje inwestorskie i blog firmowy.',
    'company.title': 'Budujemy ultrasonografy, na których polegają lekarze weterynarii',
    'company.whoTitle': 'Kim jesteśmy',
    'company.whoText': '<p>vet-eye projektuje i produkuje wysokiej klasy ultrasonografy weterynaryjne. Nasz zespół liczy ponad 45 osób i ma siedzibę w Lublinie, a na naszym sprzęcie codziennie pracuje ponad 10 000 lecznic.</p>',
    'company.valuesTitle': 'Czym się kierujemy',
    'company.valuesText': '<p>Kierujemy się nauką i wspieramy badania, które poprawiają zdrowie i dobrostan zwierząt.</p><p>Stoimy po stronie lekarzy weterynarii, którzy dbają o zdrowie zwierząt.</p><p>Lubimy nowe pomysły i nie boimy się zmian.</p>',
    'company.numbersTitle': 'vet-eye w liczbach',
    'company.investorTitle': 'Relacje inwestorskie',
    'company.investorLead': 'W 2020 roku vet-eye osiągnęło 16,2 mln dolarów przychodu, o 27,8% więcej niż w 2019 roku. Pełną prezentację i sprawozdanie finansowe znajdziesz poniżej.',
    'company.presentationHref': 'assets/docs/2020-investor-presentation-pl.pdf',
    'company.presentation': 'Prezentacja dla inwestorów 2020 (PDF)',
    'company.statement': 'Sprawozdanie finansowe 2020 (PDF)',
    'company.download': 'Pobierz',
    'blog.title': 'Z naszego bloga',
    'blog.continue': 'Czytaj dalej',
    'blog.allPosts': 'Wszystkie wpisy',
    'blog.recent': 'Najnowsze wpisy',
    'blog.share': 'Udostępnij wpis:',
    'blog.shareFacebook': 'Udostępnij na Facebooku',
    'blog.shareTwitter': 'Udostępnij na Twitterze',
    'blog.dateMar22': '22 marca 2022',
    'blog.dateOct27': '27 października 2021',
    'blog.dateMar22Short': '22 mar 2022',
    'blog.dateOct27Short': '27 paź 2021',
    'blog.aiTitle': 'Jak znaleźć najlepsze zastosowania AI w swojej firmie',
    'blog.usgTitle': 'Jak przygotować gabinet do badania USG',
    'blog.vetTitle': 'Medycyna weterynaryjna i AI',

    // ─── Blog posts ───
    'postAi.metaTitle': 'Jak znaleźć najlepsze zastosowania AI w swojej firmie | vet-eye',
    'postAi.metaDesc': 'Artykuł Bernarda Marra z „Forbesa” o tym, jak w dwóch prostych krokach znaleźć najlepsze zastosowania AI w firmie.',
    'postAi.body': `<p>Bernard Marr pokazuje w „Forbesie”, jak firma może w dwóch prostych krokach znaleźć najlepsze zastosowania AI. Polecamy lekturę.</p>
<p><a href="${FORBES_URL}" target="_blank" rel="noopener">Przeczytaj artykuł w „Forbesie”</a></p>`,

    'postUsg.metaTitle': 'Jak przygotować gabinet do badania USG | vet-eye',
    'postUsg.metaDesc': 'Osiem kroków, dzięki którym badanie USG będzie wygodne dla pacjenta, osoby, która go przytrzymuje, i badającego.',
    'postUsg.body': `<p>W spokojnym, dobrze przygotowanym gabinecie badanie jest łatwiejsze dla pacjenta, dla osoby, która go przytrzymuje, i dla Ciebie. Wystarczy osiem kroków.</p>
<ol>
  <li>Zasłoń żaluzje i zgaś światło. Łatwiej wtedy zobaczyć obraz na ekranie ultrasonografu, a w spokojniejszym otoczeniu pacjent łatwiej się rozluźnia i leży nieruchomo.</li>
  <li>Połóż legowisko weterynaryjne, żeby psu było wygodnie.</li>
  <li>Ułóż psa na prawym boku, na lewym boku albo na grzbiecie (zależnie od badanej okolicy oraz własnych preferencji i doświadczenia).</li>
  <li>Zadbaj o wygodę osoby, która przytrzymuje pacjenta. Jeśli to możliwe i stosowne, podstaw jej krzesło.</li>
  <li>Przytrzymaj pacjenta: jedną ręką chwyć przednie łapy i oprzyj przedramię na jego szyi, a drugą tylne łapy i odciągnij je doogonowo, żeby odsłonić tylną część jamy brzusznej. Przy dużym albo wyjątkowo nerwowym czy agresywnym pacjencie przyda się druga osoba do pomocy (jedna trzyma przód, druga tył).</li>
  <li>Usiądź wygodnie do badania (jeśli to możliwe i stosowne). Łatwiej wtedy skupić się na badaniu, a kark, plecy i nadgarstek mniej się męczą.</li>
  <li>Ustaw ultrasonograf tak, żeby dobrze widzieć ekran i mieć regulatory w zasięgu ręki. Łatwiej wtedy zmieniać ustawienia: dane pacjenta, preset lub typ badania, częstotliwość, głębokość, wzmocnienie, wzmocnienie zależne od czasu (TGC) i ognisko.</li>
  <li>Trzymaj głowicę z kciukiem lub palcem wskazującym na znaczniku. Łatwiej wtedy nią manewrować, bo położenie znacznika na głowicy odpowiada znacznikowi na ekranie (zwykle to kropka, strzałka albo inicjały producenta aparatu u góry obrazu USG).</li>
</ol>
<p>Teraz Tobie, pacjentowi i osobie, która go przytrzymuje, będzie dużo wygodniej i można zaczynać badanie.</p>`,

    'postVet.metaTitle': 'Medycyna weterynaryjna i AI | vet-eye',
    'postVet.metaDesc': 'Jak AI pomaga lekarzom weterynarii w analizie danych, radiografii i diagnostyce.',
    'postVet.body': `<p>AI dotyka dziś praktycznie każdej dziedziny życia. Pomaga lepiej rozumieć złożone problemy i zwiększa szanse na dobry wynik. W ochronie zdrowia ludzi AI wykorzystuje się w interpretacji obrazów, rozpoznawaniu chorób, monitorowaniu pacjentów, opracowywaniu leków, a nawet w chirurgii robotycznej.</p>
<p>Z technologii AI korzystają też lekarze weterynarii i właściciele zwierząt, przede wszystkim w radiografii, triażu i diagnostyce.</p>
<h2>Analiza danych</h2>
<p>Dr Krystle Reagan zaznacza, że nie jest informatykiem. Jest internistką weterynaryjną w szpitalu klinicznym Wydziału Weterynarii UC Davis i orędowniczką AI. Współtworzyła algorytm, który wykrywa chorobę Addisona z trafnością ponad 99%.</p>
<p>„Chorobę Addisona nazywamy »wielkim symulantem«, bo psy trafiają do nas z bardzo niejasnymi objawami klinicznymi. Wyniki krwi mogą wyglądać jak przy chorobie jelit, jak przy chorobie nerek albo jak przy chorobie wątroby. To jedno z tych schorzeń, przy których naprawdę trzeba być czujnym” – mówi dr Reagan.</p>
<p>Wyniki badań krwi ponad 1000 psów leczonych wcześniej w szpitalu klinicznym posłużyły do wytrenowania programu AI, który wykrywa złożone wzorce wskazujące na tę chorobę. Na ich podstawie program potrafił potem ocenić, czy nowy pacjent ma chorobę Addisona. Dr Reagan i jej zespół opublikowali wyniki w lipcu 2020 roku w czasopiśmie „Domestic Animal Endocrinology”.</p>
<p>Teraz dr Reagan koduje dane psów przyjętych w szpitalu klinicznym UC Davis w ostatniej dekadzie, u których rozpoznano leptospirozę albo ją podejrzewano, a potem wykluczono. Projekt prowadzą wspólnie dr Reagan, dr Strohmer oraz centrum nauki o danych i AI.</p>
<p>„Potem używamy algorytmów uczenia maszynowego, żeby wychwycić w wynikach krwi tych psów subtelne wzorce. Mogłyby nam pomóc rozstrzygnąć, czy pies ma leptospirozę, wcześniej, niż pozwala na to tradycyjna diagnostyka” – wyjaśnia dr Reagan.</p>
<p>W rozpoznawaniu leptospirozy liczy się czas, bo choroba może poważnie uszkodzić nerki, nawet w stopniu wymagającym dializy. „Niestety złoty standard diagnostyki leptospirozy to dwa badania przeciwciał w odstępie około 10 dni” – dodaje.</p>
<p>„Złoty standard oznacza, że nie mogę postawić diagnozy wcześniej niż po co najmniej 10 dniach choroby. A naprawdę potrzebujemy narzędzia, które pomoże nam powiedzieć właścicielom coś o rokowaniu, kiedy patrzymy na chorego psa i decydujemy, czy zaczynać dializę.</p>
<p>Mamy nadzieję, że znajdziemy w danych wzorce, które pomogą nam ustalić, czy pies ma leptospirozę. A przynajmniej powiedzieć właścicielowi, że naszym zdaniem jest 80% szans, że to leptospiroza, albo że to bardzo mało prawdopodobne”.</p>
<h2>Rentgenowski wzrok</h2>
<p>W radiografii AI też sprawdza się bardzo dobrze. Złożone algorytmy z dużą trafnością rozpoznają wzorce w danych obrazowych.</p>
<p>Według szacunków amerykańskiej Narodowej Akademii Medycyny w 2005 roku ukazało się około 100 publikacji naukowych o AI w radiologii, a w 2017 roku było ich już ponad 800.</p>
<p>„Do zadań, do których obecna technologia AI wydaje się dobrze nadawać, należą: ustalanie priorytetów i śledzenie zmian wymagających szybkiej reakcji, porównywanie obrazów bieżących z wcześniejszymi oraz masowe badania przesiewowe, dzięki którym radiolodzy mogą skupić się na obrazach najprawdopodobniej nieprawidłowych” – napisała akademia w raporcie z 2019 roku. „Z czasem jednak interpretację rutynowych badań obrazowych coraz częściej będą zapewne wykonywać aplikacje AI”.</p>
<p>Firma Vetology od 2010 roku świadczy tradycyjne usługi teleradiologii weterynaryjnej. Dwa lata temu zaczęła oferować analizę AI zdjęć rentgenowskich klatki piersiowej, serca i płuc u psów. Wyniki są gotowe w ciągu pięciu minut, a trafność ma dorównywać trafności radiologa weterynaryjnego, mówi dr Seth Wallack, założyciel i prezes Vetology, dyplomowany radiolog weterynaryjny.</p>
<p>„Badania radiologów medycyny ludzkiej pokazały, że średnio mają rację w 70–75% przypadków. Zawsze powtarzam, że chciałbym stawiać trafną diagnozę w 80% przypadków” – mówi dr Wallack.</p>
<p>„Żeby AI się poprawiała, niezbędna jest pętla informacji zwrotnej. Kiedy wychwytujemy problem, możemy zapytać: »Co napisała AI w opisie i dlaczego tak to zinterpretowała?«. Potem wprowadzamy drobne poprawki, żeby maszyna się uczyła, i kolejne wyniki AI są lepsze”.</p>
<p>Dr Wallack wspomina niedawny przypadek. Lekarz kierujący podejrzewał u psa lewokomorową niewydolność serca, a właściciele rozważali eutanazję. Opis radiologiczny Vetology AI nie wskazywał na chorobę ani niewydolność serca, więc lekarz poprosił Vetology, żeby zdjęcia obejrzał dyplomowany radiolog weterynaryjny. „To zlecenie trafiło do mnie. Rotacja i płyn w doogonowym odcinku piersiowym przełyku były akurat takie, że pomyślałem: »Doskonale rozumiem, jak można to wziąć za obrzęk płuc«. To nie był obrzęk i system Vetology AI odczytał zdjęcie poprawnie. Myślę, że AI właśnie uratowała psu życie” – opowiada dr Wallack.</p>
<p>I dodaje: „Zawsze uważaliśmy, że opis radiologiczny Vetology AI dostępny najpóźniej pięć minut po wykonaniu zdjęć dobrze wpłynie na wyniki leczenia. Mimo to codziennie jestem pod wrażeniem tego, co robi Vetology AI”.</p>
<h2>Przyszłość doskonała?</h2>
<p>Dr Rolan Tripp interesuje się przyszłością zawodu lekarza weterynarii. Mówi o niej od 30 lat, założył nawet Veterinary Future Society. Jest przekonany, że przyszłością medycyny weterynaryjnej jest AI.</p>
<p>„Myślę, że większość ludzi nie rozumie, jak ogromny będzie to wpływ. Tak samo sto lat temu lekarze weterynarii patrzyli na pierwszy traktor w polu i śmiali się, kiedy się psuł. Wielu z nich uważa dziś AI za chwilową modę, ale to nie jest moda. AI zrewolucjonizuje sposób, w jaki uprawiamy medycynę weterynaryjną, i to głównie na dobre” – mówi dr Tripp.</p>`,

    // ─── Not found ───
    'notFound.metaTitle': 'Nie znaleziono strony | vet-eye',
    'notFound.metaDesc': 'Nie ma takiej strony.',
    'notFound.title': 'Nie znaleziono strony',
    'notFound.text': 'Strona, której szukasz, nie istnieje albo została przeniesiona.',
    'notFound.home': 'Wróć na stronę główną',

    // ─── Contact ───
    'contact.metaTitle': 'Kontakt | vet-eye',
    'contact.metaDesc': 'Napisz do vet-eye w Lublinie z pytaniem albo prośbą o wycenę.',
    'contact.title': 'Opowiedz nam o swojej lecznicy',
    'contact.lead': 'Zadaj pytanie albo poproś o wycenę. Pomożemy dobrać ultrasonograf i odpowiemy w ciągu 48 godzin.',
    'contact.name': 'Imię i nazwisko',
    'contact.email': 'E-mail*',
    'contact.message': 'Wiadomość',
    'contact.emailError': 'Podaj poprawny adres e-mail.',
    'contact.send': 'Wyślij wiadomość',
    'contact.success': 'Dziękujemy za wiadomość. Odpowiemy w ciągu 48 godzin.',
    'contact.address': 'Lublin, Polska',
    'contact.hoursTitle': 'Godziny otwarcia',
    'contact.hours': 'Poniedziałek – piątek: 9:00–17:00',
    'contact.mapTitle': 'Mapa: Lublin, Polska',
    'contact.directions': 'Wyznacz trasę',
  },
};
