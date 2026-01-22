import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map as OlMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Icon, Style } from 'ol/style';
import styles from './Map.module.scss';

const BASE = "http://localhost:3000";

interface Branch {
  _id: string;
  name: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
}

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<OlMap | null>(null);
  const vectorLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    fetch(`${BASE}/branches/public`)
      .then((r) => r.json())
      .then((data) => {
        setBranches(data);
      })
      .catch(() => {
      });
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new OlMap({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([35.2137, 31.7683]),
        zoom: 13,
      }),
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    if (vectorLayerRef.current) {
      map.removeLayer(vectorLayerRef.current);
      vectorLayerRef.current = null;
    }

    const vectorSource = new VectorSource();
    const validBranches = branches.filter((b) => b.latitude && b.longitude);

    validBranches.forEach((branch) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([branch.longitude!, branch.latitude!])),
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
      });

      const iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: '/img/location-pin.svg',
          scale: 0.5,
          crossOrigin: 'anonymous',
        }),
      });

      feature.setStyle(iconStyle);
      vectorSource.addFeature(feature);
    });

    if (validBranches.length > 0) {
      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      map.addLayer(vectorLayer);
      vectorLayerRef.current = vectorLayer;

      // Fit map to all locations
      const extent = vectorSource.getExtent();
      if (extent && extent.length === 4 && !isNaN(extent[0]) && !isNaN(extent[1])) {
        map.getView().fit(extent, {
          padding: [50, 50, 50, 50],
          maxZoom: 12,
        });
      } else {
        // Fallback if no valid extent
        const lons = validBranches.map((b) => b.longitude!);
        const lats = validBranches.map((b) => b.latitude!);
        const centerLon = (Math.min(...lons) + Math.max(...lons)) / 2;
        const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
        
        map.getView().setCenter(fromLonLat([centerLon, centerLat]));
        map.getView().setZoom(8);
      }
    }

    return () => {
      if (vectorLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(vectorLayerRef.current);
        vectorLayerRef.current = null;
      }
    };
  }, [branches]);

  return <div ref={mapRef} className={styles.mapContainer} />;
};

export default Map;
