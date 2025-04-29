document.addEventListener("DOMContentLoaded",c);document.addEventListener("astro:page-load",c);document.addEventListener("astro:after-swap",c);function c(){const t=document.querySelector(".site-header")?.offsetHeight||0;document.documentElement.style.setProperty("--header-height",`${t}px`),document.querySelectorAll("img").forEach(a=>{a.onerror=()=>{a.src="/images/placeholder.jpg"}}),p(),document.getElementById("home-map-container")!==null?(console.log("Home page detected, initializing map functionality"),u(),g(),m()):console.log("Not on home page, skipping map initialization")}function m(){const t=document.querySelectorAll(".map-nav-pills-left .map-nav-pill"),e=document.querySelectorAll(".map-nav-pills-right .map-nav-pill");t.forEach((o,a)=>{o.style.setProperty("--delay",`${a}`),o.classList.add("animating-in")}),e.forEach((o,a)=>{o.style.setProperty("--delay",`${a}`),o.classList.add("animating-in")}),setTimeout(()=>{document.querySelectorAll(".animating-in").forEach(o=>{o.style.opacity="0"})},10)}function p(){document.querySelectorAll(".fade-in").forEach(e=>{if(e.contains(document.getElementById("home-map-container"))){e.classList.add("animated");return}e.style.opacity="",e.style.transform="",requestAnimationFrame(()=>{e.classList.add("animated")})})}function u(){if(!document.getElementById("home-map-container")){console.log("Home map container not found, skipping map functions setup");return}window.handleMapError=a=>(console.warn(`Map function ${a} was called before being defined`),()=>{});let t=0;const e=10,o=()=>{document.getElementById("map-container-home-page-map")?(console.log("Home page map container found"),document.getElementById("deck-tooltip-home-page-map")?console.log("Home page tooltip found"):t<e?(console.log(`Home page tooltip not found, retry ${t+1}/${e}`),t++,setTimeout(o,300)):console.warn("Home page tooltip not found after multiple retries")):t<e?(t++,setTimeout(o,300)):console.warn("Map container not found after multiple retries")};o(),window.addEventListener("map-loaded",a=>{a.detail?.mapId==="home-page-map"&&console.log("Map loaded event received")})}function g(){if(!document.getElementById("home-map-container")){console.log("Home map container not found, skipping map pills setup");return}const t=document.querySelectorAll(".map-nav-pill");if(!t.length){console.log("Map pills not found - this is expected on non-home pages"),setTimeout(()=>{if(!document.getElementById("home-map-container"))return;const e=document.querySelectorAll(".map-nav-pill");e.length&&(console.log(`Found ${e.length} map pills on retry`),r(e))},500);return}console.log(`Found ${t.length} map pills`),r(t)}function r(t){t.forEach((e,o)=>{const a=e.getAttribute("data-bid");console.log(`Pill ${o}: ${a}`);const n=e.cloneNode(!0);e.parentNode.replaceChild(n,e),e.style.opacity&&(n.style.opacity=e.style.opacity),n.addEventListener("click",i=>{i.preventDefault();const l=n.getAttribute("data-bid");l&&(console.log(`Pill clicked: ${l}`),n.classList.add("map-pulse"),document.querySelectorAll(".map-nav-pill").forEach(s=>{s.classList.remove("active"),s.style.opacity="0.85"}),n.classList.add("active"),n.style.opacity="1",requestAnimationFrame(()=>{document.body.classList.add("map-navigating"),setTimeout(()=>{document.body.classList.remove("map-navigating"),n.classList.remove("map-pulse"),document.querySelectorAll(".map-nav-pill:not(.active)").forEach(d=>{d.style.opacity="0.85"})},1500);const s=new CustomEvent("map-navigate-to-bid",{detail:{mapId:"home-page-map",bidName:l,dynamicZoom:!0}});console.log(`Dispatching map navigation event for ${l}`),window.dispatchEvent(s)}))})}),window.addEventListener("map-navigation-started",e=>{const{bidName:o,mapId:a}=e.detail||{};if(a!=="home-page-map"||!o)return;const n=`.map-nav-pill[data-bid="${o}"]`,i=document.querySelector(n);i&&(document.querySelectorAll(".map-nav-pill").forEach(l=>l.classList.remove("active")),i.classList.add("active"),i.classList.add("map-pulse"),i.scrollIntoView({behavior:"smooth",block:"nearest"}),setTimeout(()=>{i.classList.remove("map-pulse")},1500))})}window.addEventListener("popstate",c);if(!document.getElementById("fade-in-styles")){const t=document.createElement("style");t.id="fade-in-styles",t.textContent=`
    .fade-in {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    .fade-in.animated {
      opacity: 1;
      transform: translateY(0);
    }
    
    /* Enhanced hover effects for tooltips */
    .map-tooltip {
      filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));
    }
    
    /* Keyframe animation for navigation feedback */
    @keyframes navigationPulse {
      0% { background-color: rgba(16, 185, 129, 0.05); }
      50% { background-color: rgba(16, 185, 129, 0.15); }
      100% { background-color: rgba(16, 185, 129, 0); }
    }
    
    body.map-navigating .map-nav-pill.active {
      animation: navigationPulse 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
      opacity: 1 !important; /* Ensure active pill stays visible */
    }
    
    /* Ensure all pills stay visible during navigation */
    .map-nav-pill {
      transition: opacity 0.2s ease-out;
    }
    
    .animating-in {
      opacity: 0;
    }
  `,document.head.appendChild(t)}
