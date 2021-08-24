// Create variable to hold map element, give initial settings to map
var map = L.map('map', {
    center: [-1.08, -80.69],
    zoom: 11,
    minZoom: 11,
    scrollWheelZoom: false,
});

map.once('focus', function() { map.scrollWheelZoom.enable(); });

L.easyButton('<img src="images/fullscreen.png">', function (btn, map) {
    var cucu = [-1.08, -80.69];
    map.setView(cucu, 11);
}).addTo(map);

var esriAerialUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services' +
    '/World_Imagery/MapServer/tile/{z}/{y}/{x}';
var esriAerialAttrib = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, ' +
    'USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the' +
    ' GIS User Community';
var esriAerial = new L.TileLayer(esriAerialUrl,
    {maxZoom: 18, attribution: esriAerialAttrib}).addTo(map);


var opens = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
});


var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = (props ?
        'Cantón ' + props.PARROQUIA + '<br />' + 
        '' + props.PARROQUIA1 + '<br />' + 
        'Proyección población ' + props.POB_2020.toFixed(0)  + ' (año 2020) <br />' +  '<br />' + 
        
        '<b>Vivienda </b>' + '<br />' +
        'Vivienda adecuada: ' + props.MAT_ADE.toFixed(0) + ' %' + '<br />' +
        'Espacio vital suficiente: ' + props.ESP_VIT.toFixed(0) + ' %' + '<br />' +
        'Agua mejorada: ' + props.Agua.toFixed(0) + ' %' + '<br />' +
        'Saneamiento: ' + props.Saneamient.toFixed(0) + ' %' + '<br />' +
        'Electricidad: ' + props.Energia.toFixed(0) + ' %' + '<br />' +
        'Internet: ' + props.Internet.toFixed(0) + ' %' + '<br />' +'<br />' +

        '<b>Salud</b>' + '<br />' +
        'Proximidad centros de salud: ' + props.DxP_SALUD.toFixed(0) + ' m' + '<br />' +  
        'Contaminación residuos sólidos: ' + props.CON_SOL.toFixed(2) + ' %' + '<br />' +  '<br />' +   
        
        '<b>Educación, cultura y diversidad </b>' + '<br />' +
        'Proximidad equipamientos culturales: ' + props.DxP_BIBLIO.toFixed(0) + ' m' + '<br />' +
        'Proximidad equipamientos educativos: ' + props.DxP_EDUCA.toFixed(0) + ' m' + '<br />' +  '<br />' +  
        
        '<b>Espacios públicos, seguridad y recreación </b>' + '<br />' +
        'Proximidad espacio público: ' + props.DxP_EP.toFixed(0) + ' m' + '<br />' +
        'M² per capita de espacio público: ' + props.M2_ESP_EP.toFixed(0) + ' m' + '<br />' +
        'Densidad residencial: ' + props.PobXHas.toFixed(2) +'<br />' + 
        'Diversidad usos del suelo: ' + props.Shannon.toFixed(2) + '/1.61' +'<br />' + '<br />' +

        '<b>Oportunidades económicas </b>' + '<br />' +
        'Desempleo: ' + props.T_Desemp.toFixed(0) + ' %' + '<br />' +
        'Empleo: ' + props.T_Empleo.toFixed(0) + ' %' + '<br />' +
        'Desempleo juvenil: ' + props.Desemp_Juv.toFixed(0) + ' %' : 'Seleccione una manzana');
  
};
info.addTo(map);

function stylec(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: 0,
        dashArray: '3',
    };
}

var loc = L.geoJson(localidad, {
    style: stylec,
    onEachFeature: popupText,
}).addTo(map);

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'black',
        dashArray: '',
        fillColor: false
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

var manzanas;

function resetHighlight(e) {
    manzanas.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function style(feature) {
    return {
        weight: 0.6,
        opacity: 0.5,
        color: '#ffffff00',
        fillOpacity: 0,
    };
}


function changeLegend(props) {
    var _legend = document.getElementById('legend'); // create a div with a class "info"
    _legend.innerHTML = (props ?
        `<p style="font-size: 11px"><strong>${props.title}</strong></p>
            <p>${props.subtitle}</p>
            <p id='colors'>
                ${props.elem1}
                ${props.elem2}
                ${props.elem3}
                ${props.elem4}
                ${props.elem5}
                ${props.elem6}
                ${props.elem7}<br>
                <span style='color:#000000'>Fuente: </span>${props.elem8}<br>
            </p>` :
        `<p style="font-size: 12px"><strong>Área urbana</strong></p>
            <p id='colors'>
                <span style='color:#c3bfc2'>▉</span>Manzanas<br>
            </p>`);
}

var legends = {
    DxP_SALUD: {
        title: "Proximidad equipamientos de salud",
        subtitle: "Distancia en metros con factor inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 500</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>501 - 1500</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>1501 - 3000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>3001 - 5000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>5001 - 11858</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Alcaldía de Manta 2020",
    },
    DxP_EDUCA: {
        title: "Proximidad equipamientos de educación",
        subtitle: "Distancia en metros con factor inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 300</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>301 - 500</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>501 - 1000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>1001 - 2000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>2001 - 4384</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Alcaldía de Manta 2020",
    },
    DxP_EP: {
        title: "Proximidad espacio público",
        subtitle: "Distancia en metros con factor inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 500</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>501 - 3000</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>3001 - 5000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>5001 - 10000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>10001 - 37538</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Google Earth 2021",
    },
    PM10: {
        title: "Concentración Pm10",
        subtitle: "µg/m3",
        elem1: '<div><span  style= "color:#1a9641">▉</span>37 - 38</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>39 - 40</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>41 - 42</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>43 - 44</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>45 - 46</div>',
        elem6: ' ',
        elem7: ' ',
        elem8: "Secretaría de Ambiente de Quito Red Metropolitana de Monitoreo Ambiental REMMAQ 2020",
    },
    MAT_ADE: {
        title: "Vivienda adecuada",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>94 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>78 - 93</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>57 - 77</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>27 - 56</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 26</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo de Población y Vivienda 2010",
    },
    ESP_VIT: {
        title: "Espacio vital suficiente",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>94 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>81 - 93</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>64 - 80</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>26 - 63</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 25</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo de Población y Vivienda 2010",
    },
    Agua: {
        title: "Acceso a agua mejorada",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>87 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>64 - 86</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>39 - 63</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>14 - 38</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 13</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo de Población y Vivienda 2010",
    },
    Saneamient: {
        title: "Acceso a saneamiento",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>90 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>68 - 89</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>42 - 67</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>15 - 41</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 14</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo de Población y Vivienda 2010",
    },
    Energia: {
        title: "Acceso a electricidad",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>95 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>82 - 94</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>61 - 81</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>23 - 60</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 22</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo de Población y Vivienda 2010",
    },
    Internet: {
        title: "Acceso a internet",
        subtitle: "% de Viviendas", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>71 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>40 - 70</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>21 - 39</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>7 - 20</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 6</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo de Población y Vivienda 2010",
    },
    D_ECONO: {
        title: "Dependencia económica",
        subtitle: "Población/Población ocupada",
        elem1: '<div><span  style= "color:#1a9641">▉</span>1.5 - 2.1</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>2.2 - 2.4</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>2.5 - 2.7</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>2.8 - 3.5</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>3.6 - 4.6</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC - Enemdu 2019",
    },
    CON_SOL: {
        title: "Contaminación residuos sólidos",
        subtitle: "% de Viviendas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 7</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>8 - 23</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>24 - 44</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>45 - 79</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>80 - 100</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo de Población y Vivienda 2010",
    },
    DxP_BIBLIO: {
        title: "Proximidad equipamientos culturales",
        subtitle: "Distancia en metros con factor inclinación del terreno", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 500</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>501 - 2000</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>2001 - 5000</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>5001 - 10000</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>10001 - 45810</div>',
        elem6: '<br />Factor de inclinación del terreno <br />A nivel: 1<br /> Ligeramente inclinada: 1.25<br /> Moderadamente inclinada: 1.5<br /> Fuertemente inclinada: 1.75<br /> Escarpada: 2<br />',
        elem7: '',
        elem8: "Google Earth 2021",
    },
    M2_ESP_EP: {
        title: "M² per capita de espacio público",
        subtitle: "m²/habitante",
        elem1: '<div><span  style= "color:#1a9641">▉</span>Mayor 14</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>11 - 14</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>5 - 10</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>3 - 4</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 2</div>',
        elem6: '',
        elem7: '',
        elem8: "Gobierno Abierto de Quito 2020",
    },
    PobXHas: {
        title: "Densidad residencial",
        subtitle: "Población proyectada año 2020 x hectárea", 
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 15</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>16 - 100</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>101 - 250</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>251 - 500</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>501 - 2955</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo de Población y Vivienda 2010",
    },
    Tasa_Hurto: {
        title: "Tasa de hurtos",
        subtitle: "Hurtos x 100mil habitantes",
        elem1: '<div><span  style= "color:#1a9641">▉</span>169.3 - 395.5</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>395.6 - 716.2</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>716.3 - 1256.4</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>1256.5 - 2357.0</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>2357.1 - 4856.9</div>',
        elem6: '',
        elem7: '',
        elem8: "Observatorio Metropolitano de Seguridad Ciudadana 2019",
    },
    Tasa_Homic: {
        title: "Tasa de homicidios",
        subtitle: "Homicidios x 100mil habitantes",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.0 - 1.5</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>1.6 - 4.0</div>', 
        elem3: '<div><span  style= "color:#f4f466">▉</span>4.1 - 7.3</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>7.4 - 12.0</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>12.1 - 23.2</div>',
        elem6: '',
        elem7: '',
        elem8: "Observatorio Metropolitano de Seguridad Ciudadana 2019",
    },
    Shannon: {
        title: "Diversidad usos del suelo",
        subtitle: "Índice de Shannon-Wienner -  Nivel de diversidad por manzana",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0.87 - 1.29</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>0.60 - 0.86</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>0.37 - 0.59</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>0.16 - 0.36</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0.00 - 0.15</div>',
        elem6: '',
        elem7: '',
        elem8: "Plan de Uso y Ocupación del Suelo 2020",
    },
    T_Desemp: {
        title: "Tasa de desempleo",
        subtitle: "% Personas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 4</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>5 - 12</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>13 - 28</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>29 - 67</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>68 - 100</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo de Población y Vivienda 2010",
    },
    EMPLEO: {
        title: "Empleo",
        subtitle: "% Personas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>80 - 100</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>59 - 79</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>44 - 58</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>19 - 43</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>0 - 18</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo de Población y Vivienda 2010",
    },
    Desemp_Juv: {
        title: "Desempleo juvenil",
        subtitle: "% Personas",
        elem1: '<div><span  style= "color:#1a9641">▉</span>0 - 7</div>',
        elem2: '<div><span  style= "color:#a6d96a">▉</span>8 - 22</div>',
        elem3: '<div><span  style= "color:#f4f466">▉</span>3 - 41</div>',
        elem4: '<div><span  style= "color:#fdae61">▉</span>42 - 75</div>',
        elem5: '<div><span  style= "color:#d7191c">▉</span>76 - 100</div>',
        elem6: '',
        elem7: '',
        elem8: "INEC Censo de Población y Vivienda 2010",
    },
}

var indi = L.geoJson(Manzana, {
    style: legends.PobXHas,
}).addTo(map);

var currentStyle = 'PobXHas';

manzanas = L.geoJson(Manzana, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


function setProColor(d) {
    if (currentStyle === 'DxP_SALUD') {
        return d > 2000 ? '#d7191c' :
            d > 1000 ? '#fdae61' :
                d > 500 ? '#f4f466' :
                    d > 300 ? '#a6d96a' :
                    '#1a9641';
    }else if (currentStyle === 'DxP_EDUCA') {
        return d > 1000 ? '#d7191c' :
            d > 500 ? '#fdae61' :
                d > 300 ? '#f4f466' :
                    d > 100 ? '#a6d96a' :
                    '#1a9641';
    } 
    else if (currentStyle === 'DxP_EP') {
        return d > 10000 ? '#d7191c' :
            d > 5000 ? '#fdae61' :
                d > 3000 ? '#f4f466' :
                    d > 500 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'MAT_ADE') {
        return d > 93 ? '#1a9641' :
            d > 77 ? '#a6d96a' :
                d > 56 ? '#f4f466' :
                    d > 26 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'ESP_VIT') {
        return d > 93 ? '#1a9641' :
            d > 80 ? '#a6d96a' :
                d > 63 ? '#f4f466' :
                    d > 25 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'Agua') {
        return d > 86 ? '#1a9641' :
            d > 63 ? '#a6d96a' :
                d > 38 ? '#f4f466' :
                    d > 13 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'Saneamient') {
        return d > 89 ? '#1a9641' :
            d > 67 ? '#a6d96a' :
                d > 41 ? '#f4f466' :
                    d > 14 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'Energia') {
        return d > 94 ? '#1a9641' :
            d > 81 ? '#a6d96a' :
                d > 60 ? '#f4f466' :
                    d > 22 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'Internet') {
        return d > 70 ? '#1a9641' :
            d > 39 ? '#a6d96a' :
                d > 20 ? '#f4f466' :
                    d > 6 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'D_ECONO') {
        return d > 3.5 ? '#d7191c' :
            d > 2.7 ? '#fdae61' :
                d > 2.4 ? '#f4f466' :
                    d > 2.1 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'PM10') {
        return d > 45 ? '#d7191c' :
            d > 43 ? '#fdae61' :
                d > 40 ? '#f4f466' :
                    d > 39 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'CON_SOL') {
        return d > 79 ? '#d7191c' :
            d > 44 ? '#fdae61' :
                d > 23 ? '#f4f466' :
                    d > 7 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'DIST_BIBLI') {
        return d > 10000 ? '#d7191c' :
            d > 5000 ? '#fdae61' :
                d > 2000 ? '#f4f466' :
                    d > 500 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'M2_ESP_EP') {
        return d > 14 ? '#1a9641' :
            d > 10 ? '#a6d96a' :
                d > 4 ? '#f4f466' :
                    d > 2 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'PobXHas') {
        return d > 500 ?  '#d7191c':
            d > 250 ? '#fdae61' :
                d > 100 ? '#f4f466' :
                    d > 15 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'Tasa_Hurto') {
        return d > 2357 ?  '#d7191c':
            d > 1256.4 ? '#fdae61' :
                d > 716.2 ? '#f4f466' :
                    d > 395.5 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'Tasa_Homic') {
        return d > 12 ?  '#d7191c':
            d > 7.3 ? '#fdae61' :
                d > 4 ? '#f4f466' :
                    d > 1.5 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'Shannon') {
        return d > 0.86 ? '#1a9641' :
            d > 0.59 ? '#a6d96a' :
                d > 0.36 ? '#f4f466' :
                    d > 0.15 ? '#fdae61' :
                      '#d7191c';
    }
    else if (currentStyle === 'DxP_Comer') {
        return d > 5000 ?  '#d7191c':
            d > 3000 ? '#fdae61' :
                d > 1500 ? '#f4f466' :
                    d > 500 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'T_Desemp') {
        return d > 67 ?  '#d7191c':
            d > 28 ? '#fdae61' :
                d > 12 ? '#f4f466' :
                    d > 4 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'T_Empleo') {
        return d > 79 ?  '#d7191c':
            d > 58 ? '#fdae61' :
                d > 43 ? '#f4f466' :
                    d > 18 ? '#a6d96a' :
                    '#1a9641';
    }
    else if (currentStyle === 'Desemp_Juv') {
        return d > 75 ?  '#d7191c':
            d > 41 ? '#fdae61' :
                d > 22 ? '#f4f466' :
                    d > 7 ? '#a6d96a' :
                    '#1a9641';
    }
    else {
        return d > 44 ? '#d7191c' :
            d > 42 ? '#fdae61' :
                d > 40 ? '#f4f466' :
                    d > 38 ? '#a6d96a' :
                    '#1a9641';
    }

}


function fillColor(feature) {
    return {
        fillColor:  setProColor(feature.properties[currentStyle]),
        weight: 0.6,
        opacity: 0.1,
        color: (currentStyle) ? '#ffffff00' : '#c3bfc2', 
        fillOpacity: (currentStyle) ? 0.9 : 0.5,
    };
}

function changeIndi(style) {
    currentStyle = style.value;
    indi.setStyle(fillColor);
    changeLegend((style.value && legends[style.value]) ? legends[style.value] :
        {
            
        });
}

var baseMaps = {
    'Esri Satellite': esriAerial,
    'Open Street Map': opens

};

// Defines the overlay maps. For now this variable is empty, because we haven't created any overlay layers
var overlayMaps = {
    //'Comunas': comu,
    //'Límite fronterizo con Venezuela': lim
};

// Adds a Leaflet layer control, using basemaps and overlay maps defined above
var layersControl = new L.Control.Layers(baseMaps, overlayMaps, {
    collapsed: true,
});
map.addControl(layersControl);
changeIndi({value: 'PobXHas'});

function popupText(feature, layer) {
    layer.bindPopup('Cantón ' + feature.properties.DPA_DESCAN + '<br />')
}
