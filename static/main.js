"use strict";
let _app = document.getElementById("_app");
let programs = [
    { name: "Academic talk", pt: 2 },
    { name: "Mappila song", pt: 2 },
    { name: "Gazal urdu", pt: 2 },
    { name: "Speech and song", pt: 5 },
];
function getActPrg(prg) {
    return programs.find((e) => e.name == prg);
}
let HOST = location.origin.replace(/^http/, "ws");
let ws = new WebSocket(HOST);
let _params = new URLSearchParams(window.location.search);
let _hash = _params.get("hash");
console.log(_hash);
function App() {
    var _a;
    const [ActTab, setActTab] = useState(null);
    const [ActProgData, setActProgData] = useState(null);
    const [ActProgOthData, setActProgOthData] = useState(null);
    const [House, setHouse] = useState(null);
    const [Notif, setNotif] = useState(null);
    function Notification() {
        return (h("div", null, Notif && (h("div", { class: `notification ${Notif.type}` },
            h("button", { class: "delete" }),
            Notif.cont))));
    }
    let _funcs = {
        _get: ({ oth, yours, house, prog }) => {
            var _a;
            if (prog == ActTab) {
                console.log(oth, yours);
                let _minus = ((_a = getActPrg(ActTab)) === null || _a === void 0 ? void 0 : _a.pt) - yours.length;
                let _extData = Array.from(Array(_minus).keys()).map((e, i) => ({
                    text: null,
                    progId: `${house}-${prog}-${yours.length + 1 + i}`,
                    house: house,
                    //prog: prog,
                }));
                let _yours = [...yours, ..._extData];
                setActProgData(_yours);
                setActProgOthData(oth);
                setHouse(house);
            }
        },
        updated: ({ prog, oth }) => {
            //console.log(oth, "wwwwwwwwwwwwwwwwwwwwwwww");
            if (ActTab == prog) {
                setActProgOthData(oth);
            }
            //setNotif()
            // if(ActTab==prog){
            //     setActProgOthData
            // }
        },
    };
    ws.onmessage = ({ data }) => {
        console.log(data, "asdfasdf");
        let _ = JSON.parse(data);
        console.log(_);
        _funcs[_._func](_);
        //ws.send("dfasdf")
    };
    useEffect(() => {
        /// console.log(ActTab);
        console.log("ww", ws.readyState);
        if (ws.readyState === WebSocket.OPEN) {
            console.log("asdfasd");
            ws.send(JSON.stringify({ _func: "_get", _id: _hash, prog: ActTab }));
        }
        return () => {
            //  ws.close()
        };
    }, [ActTab]);
    return (h("div", { className: "_app" },
        h("div", { class: "tabs" },
            h("ul", null, programs.map((e) => (h("li", { class: ActTab == e.name && "is-active", onclick: () => {
                    setActTab(e.name);
                }, key: e.name },
                h("a", null, e.name)))))),
        h("h2", { class: "is-size-3 mx-5" }, Array((_a = getActPrg(ActTab)) === null || _a === void 0 ? void 0 : _a.name)),
        h("div", { class: "mx-5" }, House && "house:" + House),
        ActTab && ActProgData && (h("div", { className: "_regArea p-5" }, ActProgData.map((e) => (h("div", null,
            h("textarea", { value: e.text, onChange: ({ target }) => {
                    let _ = ActProgData;
                    let _ind = ActProgData.findIndex((_in) => _in.progId == e.progId);
                    _[_ind].text = target.value;
                    setActProgData(_);
                }, class: "textarea mt-5", placeholder: "e.g. Hello world" }),
            h("button", { onClick: () => {
                    console.log(e);
                    ws.send(JSON.stringify(Object.assign({ _func: "update", _id: _hash, prog: ActTab }, e)));
                }, class: "button is-link" }, "Send")))))),
        ActProgOthData && (h("div", { class: "has-background-link-light" },
            h("div", { className: "is-size-4 p-5" }, "Already Selected"),
            h("div", { className: "OthData p-5 " },
                h("div", { className: "container" }, ActProgOthData.map((e) => (h("div", { class: "box  " }, e.text))))))),
        h(Notification, null)));
}
//_app?.append(dd);
render(h(App, null), _app);
