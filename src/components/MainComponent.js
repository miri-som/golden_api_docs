import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from "react";
import "../json.json";
import jsonData from "../json.json";
import '../App.css';

export default function MainComponent() {
    const [data, setData] = useState(null);
    const [description, setDescription] = useState('');
    const [methodValue, setMethodValue] = useState(null);
    const [urlValue, setUrlValue] = useState(null);
    const [serverKay, setServerKay] = useState(null);
    const [serverValue, setServerValue] = useState(null);
    const [paramsValue, setParamsValue] = useState(null);
    const [presetsValue, setPresetsValue] = useState(null);
    const [jsonParamsKey, setJsonParamsKey] = useState(null);

    const serverArray = [
        // { key: "מקומי", value: "http://localhost:4001" },
        { key: "פיתוח", value: "http://192.168.84.13:4001" },
        { key: "ראשי", value: "http://192.168.200.2:4001" },//"http://147.235.69.241:4001"
        { key: "בדיקות", value: "http://192.168.84.5:4001" }
    ];

    const handleSubmit = () => {
        if (jsonData && jsonData.length > 0 && presetsValue) {
            const selectedValue = presetsValue;
            const selectedData = jsonData.find(item => item.name === selectedValue);
            if (selectedData) {
                fetch(urlValue)
                    .then(response => response.json())
                    .then(data => setData(data))
                    .catch(error => console.error('Error fetching data:', error));
            }
        }
    };

    const changeURL = () => {
        const replaceParamsIndex = urlValue.indexOf(jsonParamsKey);
        const replaceParams = urlValue.substring(0, replaceParamsIndex) + urlValue.substring(replaceParamsIndex + jsonParamsKey.length);
        const onlyValueParamsIndex = paramsValue.indexOf(':');
        const onlyValueParams = paramsValue.substring(onlyValueParamsIndex + 1, paramsValue.length - 1);
        setUrlValue(replaceParams + '' + onlyValueParams);
        setJsonParamsKey(onlyValueParams);
    }

    const changeParamsValue = (event) => {
        setParamsValue(event.target.value);
    }
    useEffect(() => {
        if (presetsValue) {
            const selectedValue = presetsValue;
            const selectedData = jsonData.find(item => item.name === selectedValue);
            if (selectedData) {
                setData(null);
                setDescription(selectedData.description);
                setMethodValue(selectedData.method);
                setUrlValue(serverValue ? serverValue + '' + selectedData.url : "");
                setServerKay(serverArray.find(server => server.value === serverValue)?.key);
                setParamsValue(selectedData.params ? `{${selectedData.params[0].key}:${selectedData.params[0].value}}` : 'No-Params');
                if (selectedData.params) {
                    const replaceParamsIndex = selectedData.url.indexOf(selectedData.params[0].key);//selectedData.params[0].key מתאים רק כשיש פרמטר אחד
                    const jsonParamsKey = selectedData.url.substring(replaceParamsIndex - 1, replaceParamsIndex + selectedData.params[0].key.length + 1);
                    setJsonParamsKey(jsonParamsKey);
                }
            }
        }
        // eslint-disable-next-line
    }, [presetsValue, serverValue])
    useEffect(() => {
        setServerValue(serverArray[0].value);
        // eslint-disable-next-line
    }, [])

    return (
        <div className='App' >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row-reverse" }}>
                <div className='header' style={{ fontSize: "20pt", flex: "1" }}> GOLDEN API DOCS </div>
                <div className='server' style={{ flex: "0 10%" }}>
                    <Autocomplete
                        options={serverArray.map(item => item.key)}
                        onChange={(event, value) => {
                            if (value) {
                                const selectedServer = serverArray.find(server => server.key === value);
                                if (selectedServer) {
                                    setServerValue(selectedServer.value);
                                    setData(null);
                                }
                            } else {
                                setServerValue("");
                            }
                        }}
                        value={serverArray.find(item => item.key === serverKay)?.key || serverArray[0].key || ""}
                        renderInput={(params) => (
                            <TextField {...params}
                                variant="outlined"
                                label="Server"
                            />
                        )}
                    />
                </div>
            </div>
            <div className="content-wrapper" >
                <div className="left-content" >
                    <div className="Presets">
                        <Autocomplete
                            options={jsonData.map(item => item.name)}
                            onChange={(event, value) => {
                                if (value) {
                                    setPresetsValue(value);
                                    setData(null);
                                } else {
                                    setPresetsValue(null);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params}
                                    variant="outlined"
                                    label="End Point"
                                />
                            )}
                        />
                    </div>
                    <div className="URL" style={{ display: "flex", flexDirection: "row" }}>
                        <TextField
                            sx={{ width: "20%" }}
                            value={methodValue || ""}
                            variant='outlined'
                        />
                        <TextField
                            sx={{ width: "80%" }}
                            value={urlValue || ""}
                            variant='outlined'
                        />
                        <button type="submit" style={{ width: "20%" }} onClick={handleSubmit}>Send</button>
                    </div>
                    <div className="query_params">
                        <div> <b>Query-Params:</b></div>
                        <textarea style={{ width: "100%", height: "460px", fontSize: "20px" }}
                            value={paramsValue || ""}
                            variant='outlined'
                            onChange={changeParamsValue}
                            onBlur={changeURL}
                        />
                    </div>
                </div>
                <div className="right-content" >
                    <div className='description'>
                        <div><b>Description:</b></div>
                        <textarea
                            style={{ textAlign: "center", fontSize: "15pt", width: "100%", height: "200px" }}
                            defaultValue={description}
                        />
                    </div>
                    <div className='response'>
                        <div><b>Response:</b></div>
                        <textarea
                            style={{ width: "100%", minHeight: "100%", height: "400px" }}
                            defaultValue={data ? JSON.stringify(data) : null}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

}