document.addEventListener("DOMContentLoaded", () => {
    // Datos: única fuente para textos y cuadrículas
    // UCh institucional: 186 | Polimi institucional: 87
    // UCh Art&Design: 101-150 (usamos 101) | Polimi Art&Design: 7
    const datos = {
        universidades: { total: 1504, origen: 186, destino: 87 },
        escuelas: { total: 303, origen: 101, destino: 7 },
    };

    document.querySelectorAll("[data-dato]").forEach((el) => {
        const [grupo, campo] = el.dataset.dato.split(".");
        el.textContent = datos[grupo][campo];
    });

    // Cuadrículas de ranking
    const ranking = (id, { total, origen, destino }) => {
    const min = Math.min(origen, destino);
    const max = Math.max(origen, destino);
    const celdas = Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const clase = n === destino ? "destino" : n === origen ? "origen" : n > min && n < max ? "entre" : "";
        return `<span class="${clase}">${n}</span>`;
    });
    document.getElementById(id).innerHTML = celdas.join("");
};

    ranking("universidades", datos.universidades);
    ranking("escuelas", datos.escuelas);

    // Gráficos de radar
    const radar = (id) =>
        new Chart(document.getElementById(id), {
            type: "radar",
            data: {
                labels: ["Academic Reputation", "Employer Reputation", "Faculty Student Ratio", "Citations per Faculty", "International Students"],
                datasets: [
                    {
                        label: "U. de Chile",
                        data: [79.1, 81.7, 21.0, 24.5, 5.7],
                        borderColor: "rgb(54, 162, 235)",
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                    },
                    {
                        label: "Politecnico di Milano",
                        data: [87.1, 86.0, 47.9, 56.3, 13.1],
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                    },
                ],
            },
            options: {
    responsive: true,
    plugins: {
        tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false
        },
        legend: {
            display: true,
            position: 'top'
        }
    },
    scales: {
        r: { min: 0, max: 100, ticks: { stepSize: 20 } }
    }
}
        });

    radar("comparaUniversidades");
    radar("comparaEscuelas");

    // Mapa: origen (U. de Chile) y destino (Politecnico di Milano)
    const map = L.map("map").setView([10, -30], 2);

    L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 16, attribution: "Tiles &copy; Esri" }
    ).addTo(map);

    // Marcador de origen: FAU U. de Chile
    L.marker([-33.4422, -70.638017])
        .addTo(map)
        .bindPopup("<b>Universidad de Chile</b><br />Facultad de Arquitectura y Urbanismo.");

    // Marcador de destino: Politecnico di Milano (Campus Bovisa)
    L.marker([45.4773, 9.2278])
        .addTo(map)
        .bindPopup("<b>Politecnico di Milano</b><br />Campus Bovisa.");
});