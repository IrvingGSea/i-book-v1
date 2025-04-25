
fetch('expanded-taxonomy-graph.json')
  .then(res => res.json())
  .then(data => {
    const nodes = new vis.DataSet(data.nodes);
    const edges = new vis.DataSet(data.edges);
    const container = document.getElementById("mynetwork");

    const networkData = { nodes, edges };
    const options = {
      nodes: {
        shape: 'dot',
        size: 16,
        font: { size: 14, color: '#000' }
      },
      edges: {
        arrows: 'to',
        smooth: true,
        color: { color: '#aaa', highlight: '#222' }
      },
      groups: {
        arch: { color: 'crimson' },
        asm: { color: 'darkorange' },
        flow: { color: 'goldenrod' },
        stack: { color: 'steelblue' },
        int: { color: 'teal' },
        peri: { color: 'purple' }
      },
      physics: { stabilization: true }
    };

    const network = new vis.Network(container, networkData, options);

    network.on("click", function (params) {
      const clicked = params.nodes[0];
      if (!clicked) return;

      edges.forEach((e, id) => {
        edges.update({ id: id, color: { color: '#aaa' } });
      });

      let visited = new Set();
      function highlightForward(nodeId) {
        visited.add(nodeId);
        edges.forEach(edge => {
          if (edge.from === nodeId && !visited.has(edge.to)) {
            edges.update({ id: edge.id, color: { color: 'black' } });
            highlightForward(edge.to);
          }
        });
      }

      highlightForward(clicked);
    });
  });
