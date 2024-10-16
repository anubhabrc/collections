import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const GameOfThronesRelations = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    // Helper functions
    const onlyUnique = (value, index, self) => self.indexOf(value) === index;

    // Configuration
    const config = {
      title: "Relations",
      width: 1500,
      height: 1500,
      margin: 20,
      directed: [
        {
          type: "killedBy",
          style: {
            stroke: "#000",
            strokeWidth: 1.5,
            strokeOpacity: 1,
          },
          textStyle: {
            fontSize: "0.8em",
            dominantBaseline: "central",
          },
        },
      ],
      undirected: [
        {
          type: "parentOf",
          style: {
            stroke: "#999",
            strokeWidth: 1,
            strokeOpacity: 0.6,
          },
          textStyle: {
            fontSize: "1em",
            dominantBaseline: "central",
          },
        },
        {
          type: "marriedEngaged",
          style: {
            stroke: "blue",
            strokeWidth: 1,
            strokeOpacity: 0.6,
            strokeDasharray: "5,5",
          },
          textStyle: {
            fontSize: "1em",
            dominantBaseline: "central",
          },
        },
      ],
    };

    // Load data
    const loadData = async () => {
      try {
        const response = await fetch("./data/characters.json");
        const data = await response.json();
        return data.characters;
      } catch (error) {
        console.error("Error loading data:", error);
        return [];
      }
    };

    const initializeVisualization = (characters) => {
      if (!characters || characters.length === 0) {
        console.error("No character data available");
        return;
      }

      const svg = d3
        .select(svgRef.current)
        .attr("width", config.width)
        .attr("height", config.height);

      const directed = config.directed.map((v) => v.type);
      const undirected = config.undirected.map((v) => v.type);
      const relationships = [...directed, ...undirected];

      let charactersArray = [];
      let matrix = {
        nodes: [],
        links: [],
      };

      // Build array of characters involved
      relationships.forEach((val) => {
        characters.forEach((value) => {
          if (value.hasOwnProperty(val)) {
            charactersArray.push(value.characterName);
            if (Array.isArray(value[val])) {
              value[val].forEach((v) => {
                charactersArray.push(v);
              });
            }
          }
        });
      });

      // Deduplicate array
      charactersArray = charactersArray.filter(onlyUnique).sort();

      // Modify charactersArray to be objects with image files, other info
      charactersArray = charactersArray.map((v) => {
        const index = characters.findIndex(
          (element) => element.characterName === v
        );
        const image =
          index > -1 && characters[index].characterImageThumb
            ? characters[index].characterImageThumb
            : null;
        return {
          name: v,
          image: image,
        };
      });

      // Add nodes to matrix
      matrix.nodes = charactersArray.map((val) => ({
        id: val.name,
        group: 1,
        image: val.image,
      }));

      // Build list of links
      relationships.forEach((val) => {
        characters.forEach((value) => {
          if (value.hasOwnProperty(val) && Array.isArray(value[val])) {
            value[val].forEach((v) => {
              matrix.links.push({
                source: value.characterName,
                target: v,
                value: 1,
                type: val,
                id: Math.floor(Math.random() * 100000),
              });
            });
          }
        });
      });

      // Deduplicate links
      matrix.links = matrix.links.filter((val, ind) => {
        return !matrix.links.some(
          (v, i) =>
            i > ind &&
            val.source === v.target &&
            val.target === v.source &&
            val.type === v.type
        );
      });

      // Build the visualization
      const width = config.width;
      const height = config.height;
      const links = matrix.links;
      const nodes = matrix.nodes;
      const radius = 20;

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3
            .forceLink(links)
            .id((d) => d.id)
            .distance(100)
        )
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force(
          "collision",
          d3
            .forceCollide()
            .radius(() => radius * 2.5)
            .iterations(2)
        )
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("y", d3.forceY(height / 2).strength(0.1));

      // Add arrowhead marker definition
      svg
        .append("defs")
        .append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "-0 -5 10 10")
        .attr("refX", 23)
        .attr("refY", 0)
        .attr("orient", "auto")
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("xoverflow", "visible")
        .append("svg:path")
        .attr("d", "M 0,-5 L 10 ,0 L 0,5")
        .attr("fill", "red")
        .style("stroke", "none");

      const link = svg
        .append("g")
        .attr("class", "links")
        .selectAll("path")
        .data(links)
        .enter()
        .append("path")
        .attr("class", (d) => `link ${d.type}`)
        .attr("stroke", "#999")
        .attr("stroke-opacity", "0.6")
        .attr("fill", "none")
        .attr("stroke-width", 0)
        .attr("id", (d) => d.id)
        .attr("marker-end", "url(#arrowhead)");

      // Add images to nodes
      svg
        .append("defs")
        .selectAll("pattern")
        .data(nodes.filter((d) => d.image))
        .enter()
        .append("pattern")
        .attr("id", (d) => d.id.toLowerCase().replace(/([^A-Z0-9])/gi, ""))
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .attr("viewBox", "0 0 1 1")
        .attr("preserveAspectRatio", "xMidYMid slice")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("xlink:href", (d) => d.image);

      const node = svg
        .append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      node
        .append("circle")
        .attr("r", radius)
        .attr("fill", (d) =>
          d.image
            ? `url(#${d.id.toLowerCase().replace(/([^A-Z0-9])/gi, "")})`
            : color(d.group)
        )
        .attr("stroke", "white")
        .attr("stroke-width", "1.5");

      node
        .append("text")
        .attr("dy", 1.45 * radius)
        .attr("text-anchor", "middle")
        .text((d) => d.id)
        .attr("font-size", "10px")
        .attr("font-family", "sans-serif");

      // Apply the styles of the arrays
      [...config.directed, ...config.undirected].forEach((val) => {
        svg
          .selectAll(`.${val.type}`)
          .style("stroke", val.style.stroke)
          .style("stroke-width", val.style.strokeWidth)
          .style("stroke-opacity", val.style.strokeOpacity)
          .style("stroke-dasharray", val.style.strokeDasharray);
      });

      simulation.on("tick", ticked);

      function positionLink(d) {
        if (
          !d.source ||
          !d.target ||
          !isFinite(d.source.x) ||
          !isFinite(d.source.y) ||
          !isFinite(d.target.x) ||
          !isFinite(d.target.y)
        ) {
          return null;
        }

        const offset = 30;
        let midpoint = [
          (d.source.x + d.target.x) / 2,
          (d.source.y + d.target.y) / 2,
        ];
        let dx = d.target.x - d.source.x;
        let dy = d.target.y - d.source.y;
        let normalise = Math.sqrt(dx * dx + dy * dy);

        if (normalise === 0) {
          return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`;
        }

        midpoint[0] += offset * (dy / normalise);
        midpoint[1] -= offset * (dx / normalise);

        return `M${d.source.x},${d.source.y} Q${midpoint[0]},${midpoint[1]} ${d.target.x},${d.target.y}`;
      }

      function ticked() {
        link.attr("d", (d) => {
          const path = positionLink(d);
          return path ? path : null;
        });

        node.attr("transform", (d) => {
          const padding = radius * 2;
          d.x = Math.max(padding, Math.min(width - padding, d.x));
          d.y = Math.max(padding, Math.min(height - padding, d.y));
          return `translate(${d.x},${d.y})`;
        });
      }

      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
    };

    // Delay the initialization to ensure the SVG is fully rendered
    const timer = setTimeout(() => {
      loadData().then(initializeVisualization);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full bg-white">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default GameOfThronesRelations;
