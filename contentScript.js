document.getElementById("hae-vastaukset").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];

        function HaeVastaukset() {
            sivunTextareat = document.body.querySelectorAll("textarea[name='exam']");
            sivunCheckboxit = document.body.querySelectorAll("input[type='checkbox']");
            sivunRadiot = document.body.querySelectorAll("input[type='radio']");
            vastaukset = [new Array(sivunTextareat.length), new Array(sivunCheckboxit.length), new Array(sivunRadiot.length)]; // Luodaan uusi tyhjä taulukko

            // Lisätään käyttäjän vastaukset "vastaukset"-taulukon alitaulukoihin
            for (i = 0; i < sivunTextareat.length; i++) {
                vastaukset[0][i] = sivunTextareat[i].value;
            }
            for (i = 0, j = 0; i < sivunCheckboxit.length; i++) {
                vastaukset[1][i] = sivunCheckboxit[i].checked;
            }
            for (i = 0; i < sivunRadiot.length; i++) {
                vastaukset[2][i] = sivunRadiot[i].checked;
            }

            return vastaukset;
        }

        chrome.scripting
            .executeScript({
                target: { tabId: tab.id },
                func: HaeVastaukset
            }, (result) => {
                document.body.querySelector("#haettu-vastaus").value = JSON.stringify(result[0].result);
            })
    });
});

document.getElementById("lataa-vastaukset").addEventListener("click", () => {
    ladattavatVastaukset = JSON.parse(document.body.querySelector("#ladattava-vastaus").value);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];

        function LataaVastaukset(ladattavatVastaukset) {
            sivunTextareat = document.body.querySelectorAll("textarea[name='exam']");
            sivunCheckboxit = document.body.querySelectorAll("input[type='checkbox']");
            sivunRadiot = document.body.querySelectorAll("input[type='radio']");

            for (i = 0; i < sivunTextareat.length; i++) {
                sivunTextareat[i].value = ladattavatVastaukset[0][i];
            }
            for (i = 0, j = 0; i < sivunCheckboxit.length; i++) {
                sivunCheckboxit[i].checked  = ladattavatVastaukset[1][i];
            }
            for (i = 0; i < sivunRadiot.length; i++) {
                sivunRadiot[i].checked = ladattavatVastaukset[2][i];
            }
        }

        chrome.scripting
            .executeScript({
                args: [ladattavatVastaukset],
                target: { tabId: tab.id },
                func: LataaVastaukset
            })
    });
});

document.getElementById("lataa-vastaukset-url").addEventListener("click", () => {
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        
        function LataaVastaukset(ladattavatVastaukset) {
            const urlParams = new URLSearchParams(window.location.search);
            ladattavatVastaukset = JSON.parse(decodeURIComponent(urlParams.get('vastaukset'))/*.replaceAll("\\","\\\\").replaceAll("\n", "\\n")*/);

            sivunTextareat = document.body.querySelectorAll("textarea[name='exam']");
            sivunCheckboxit = document.body.querySelectorAll("input[type='checkbox']");
            sivunRadiot = document.body.querySelectorAll("input[type='radio']");

            for (i = 0; i < sivunTextareat.length; i++) {
                sivunTextareat[i].value = ladattavatVastaukset[0][i];
            }
            for (i = 0, j = 0; i < sivunCheckboxit.length; i++) {
                sivunCheckboxit[i].checked  = ladattavatVastaukset[1][i];
            }
            for (i = 0; i < sivunRadiot.length; i++) {
                sivunRadiot[i].checked = ladattavatVastaukset[2][i];
            }
        }

        chrome.scripting
            .executeScript({
                target: { tabId: tab.id },
                func: LataaVastaukset
            })
    });
});


document.getElementById("kopioi-leikepoydalle").addEventListener("click", () => {
    var copy = document.querySelector("#haettu-vastaus");

    copy.select();

    navigator.clipboard.writeText(copy.value);

    document.querySelector("#kopioi-leikepoydalle .kopioitu").style.display = "block";
});

document.getElementById("kopioi-leikepoydalle-url").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        
        function haeNykyinenUrl(tabs) {
            return tabs[0].url;
        }

        chrome.scripting
        .executeScript({
            args: [tabs],
            target: { tabId: tab.id },
            func: haeNykyinenUrl
        }, (result) => {
            var copy = document.querySelector("#haettu-vastaus");
            copy.select();            
            url = result[0].result;
            navigator.clipboard.writeText(url.split('?')[0].split('#')[0] + "?vastaukset=" + encodeURIComponent(copy.value));
            document.querySelector("#kopioi-leikepoydalle-url .kopioitu").style.display = "block";
        })
    });
});

