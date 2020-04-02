function getPlots(id) {
//Read samples.json
    d3.json("data/samples.json").then (sampledata =>{
        console.log(sampledata)
        var ids = sampledata.samples[0].otu_ids;
        console.log(ids)
        var sampleValues =  sampledata.samples[0].sample_values.slice(0,10).reverse();
        console.log(sampleValues)
        var labels =  sampledata.samples[0].otu_labels.slice(0,10);
        console.log(labels)
        var result = sampledata.metadata.filter(meta => meta.id.toString() === id)[0];
        console.log(result.wfreq)
    // get only top 10 otu ids for the plot OTU and reversing it. 
        var OTU_top = ( sampledata.samples[0].otu_ids.slice(0, 10)).reverse();
    // get the otu id's to the desired form for the plot
        var OTU_id = OTU_top.map(d => "OTU " + d);
        console.log(`OTU IDS: ${OTU_id}`)
     // get the top 10 labels for the plot
        var labels =  sampledata.samples[0].otu_labels.slice(0,10);
        console.log(`OTU_labels: ${labels}`)
        var trace = {
            x: sampleValues,
            y: OTU_id,
            text: labels,
            marker: {
            color: 'green'},
            type:"bar",
            orientation: "h",
        };
        // create data variable
        var data = [trace];

        // create layout variable to set plots layout
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };

        // create the bar plot
    Plotly.newPlot("bar", data, layout);

     // Data for the gauge chart
     var data = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: result.wfreq,
        title: { text: "Belly Button Washing Frequency (per Week)" },
        type: "indicator",
        mode: "gauge+number",
        // label: ["0-1","0-1","0-1","0-1","0-1","0-1","0-1","0-1","0-1","0-1"],
        gauge: {
            axis: { range: [0, 9] },
            bar: { color: "#585858" },
            steps: [
                { range: [0, 1], color: "rgb(247, 240, 232)" },
                { range: [1, 2], color: "rgb(242, 238, 222)" },
                { range: [2, 3], color: "rgb(228, 226, 189)" },
                { range: [3, 4], color: "rgb(223, 229, 161)" },
                { range: [4, 5], color: "rgb(203, 225, 136)" },
                { range: [5, 6], color: "rgb(169, 196, 125)"},
                { range: [6, 7], color: "rgb(121, 182, 115)"},
                { range: [7, 8], color: "rgb(120, 177, 123)"},
                { range: [8, 9], color: "rgb(115, 169, 117)"}
            ]
        }
    }];

    // Plot gauge chart
    Plotly.newPlot("gauge", data);

        // The bubble chart
        var trace1 = {
            x: sampledata.samples[0].otu_ids,
            y: sampledata.samples[0].sample_values,
            mode: "markers",
            marker: {
                size: sampledata.samples[0].sample_values,
                color: sampledata.samples[0].otu_ids
            },
            text:  sampledata.samples[0].otu_labels

        };

        // set the layout for the bubble plot
        var layout_2 = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };

        // creating data variable 
        var data1 = [trace1];

    // create the bubble plot
    Plotly.newPlot("bubble", data1, layout_2); 
    
    });
}  
// create the function to get the necessary data
function getDemoInfo(id) {
// read the json file to get data
    d3.json("data/samples.json").then((data)=> {
// get the metadata info for the demographic panel
        var metadata = data.metadata;

        console.log(metadata)

      // filter meta data info by id
       var result = metadata.filter(meta => meta.id.toString() === id)[0];
       
      // select demographic panel to put data
       var demographicInfo = d3.select("#sample-metadata");
        
     // empty the demographic info panel each time before getting new id info
       demographicInfo.html("");

     // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}
// create the function for the change event
function optionChanged(id) {
    getPlots(id);
    getDemoInfo(id);
}
// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("data/samples.json").then((data)=> {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        getPlots(data.names[0]);
        getDemoInfo(data.names[0]);
    });
}

init();
