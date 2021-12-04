declare namespace JSX {
  interface IntrinsicElements {
    div: any;
    ul: any;
    li: any;
    h2: any;
    a: any;
    textarea: any;
    button: any;
  }
}

let _app = document.getElementById("_app");

let programs = [
  { name: "Academic talk", pt: 2 },
  { name: "Mappila song", pt: 2 },
  { name: "Gazal urdu", pt: 2 },
  { name: "Speech and song", pt: 5 },
];

function getActPrg(prg: string) {
  return programs.find((e) => e.name == prg);
}

let HOST = location.origin.replace(/^http/, "ws");
let ws = new WebSocket(HOST);

let _params = new URLSearchParams(window.location.search);
let _hash = _params.get("hash");
console.log(_hash);

function App() {
  const [ActTab, setActTab] = useState(null);
  const [ActProgData, setActProgData] = useState(null);
  const [ActProgOthData, setActProgOthData] = useState(null);

  const [House, setHouse] = useState(null)
  const [Notif, setNotif] = useState(null);

  function Notification() {
    return (
      <div>
        {Notif && (
          <div class={`notification ${Notif.type}`}>
            <button class="delete"></button>
            {Notif.cont}
          </div>
        )}
      </div>
    );
  }

  let _funcs = {
    _get: ({ oth, yours, house, prog }) => {
      if (prog == ActTab) {
        console.log(oth, yours);
        let _minus = getActPrg(ActTab)?.pt - yours.length;
        let _extData = Array.from(Array(_minus).keys()).map((e, i) => ({
          text: null,
          progId: `${house}-${prog}-${yours.length + 1 + i}`,
          house: house,
          //prog: prog,
        }));
        let _yours = [...yours, ..._extData];
        setActProgData(_yours);
        setActProgOthData(oth);
        setHouse(house)
      }
    },
    updated: ({ prog, oth }) => {
      //console.log(oth, "wwwwwwwwwwwwwwwwwwwwwwww");
        if(ActTab==prog){
            setActProgOthData(oth)
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

  return (
    <div className="_app">
      <div class="tabs">
        <ul>
          {programs.map((e) => (
            <li
              class={ActTab == e.name && "is-active"}
              onclick={() => {
                setActProgData(null)
                setActProgData(null)
                setActTab(e.name);

              }}
              key={e.name}
            >
              <a>{e.name}</a>
            </li>
          ))}
        </ul>
      </div>
      <h2 class="is-size-3 mx-5">{Array(getActPrg(ActTab)?.name)}</h2>
      <div class="mx-5">
          {House&&"house:"+House}
      </div>
      {ActTab && ActProgData && (
        <div className="_regArea p-5">
          {ActProgData.map((e: {}) => (
            <div>
              <textarea
                value={e.text}
                onChange={({ target }) => {
                  let _ = ActProgData;
                  let _ind = ActProgData.findIndex(
                    (_in) => _in.progId == e.progId
                  );
                  _[_ind].text = target.value;
                  setActProgData(_);
                }}
                class="textarea mt-5"
                placeholder="e.g. Hello world"
              ></textarea>
              <button
                onClick={() => {
                  console.log(e);

                  ws.send(
                    JSON.stringify({
                      _func: "update",
                      _id: _hash,
                      prog: ActTab,
                      ...e,
                    })
                  );
                }}
                class="button is-link"
              >
                Send
              </button>
            </div>
          ))}
        </div>
      )}

      {ActProgOthData && (
        <div class="has-background-link-light">
          <div className="is-size-4 p-5">
              Already Selected
          </div>
          <div className="OthData p-5 ">
            <div className="container">
              {ActProgOthData.map((e) => (
                <div class="box  ">{e.text}</div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Notification />
    </div>
  );
}

//_app?.append(dd);
render(<App />, _app);
