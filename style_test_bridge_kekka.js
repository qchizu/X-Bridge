{
  geojsonOptions:{
    pointToLayer: function(feature, latlng){

      //マークの設定
      var kigo = this.dealer;
      switch (true) {
        case (feature.properties["result"] == "✕"):
          kigo = "https://qchizu.github.io/X-Bridge/batsu-01.png";
          break;
        case (feature.properties["result"] == "〇" ):
          kigo = "https://qchizu.github.io/X-Bridge/maru-01.png";
          break;
      default:
        kigo = "https://mapdata.qchizu.xyz/icon/mura.png" ;
      };

      var imgel = "<img src='" + kigo + "' class='leaflet-marker-icon'></img>";
      //var spanel = "<span style='position:absolute; left:15px; top:-1px;font-family: BIZ UDPGothic, sans-serif;font-size:16px;font-weight:bold;background-color:rgba(255,255,255,0.5);display:inline;color:rgb(164,0,53);line-height:16px;'>" + feature.properties["bridge_name"] + "</span>";
      spanel = ""
      var htmlel = "";

      htmlel = imgel + spanel;
      var myIcon = L.divIcon({html:htmlel, className:"gsi-div-icon", iconAnchor: [12, 12], iconSize: [24, 24]});
      
      return L.marker(latlng, {icon: myIcon});
    },

    onEachFeature: function (feature, layer){
      var s = "<table>";
        //タイトル
        s += "<tr><th colspan='2' style='font-size:16px; font-weight:bold; color:#000000; font-family:BIZ UDPGothic, sans-serif;'>" + feature.properties["bridge_name"]  + "</th></tr>";
        //項目
        var cssl = "<tr><td style='vertical-align:middle; font-size:14px; color:#0000ff; font-family:BIZ UDPGothic, sans-serif; white-space:nowrap;'>";
        var cssr = "<td style='font-size:14px; color:#000000;'>"; 
        s += cssl + "報告日時" + "</td>"
               + cssr + String(feature.properties["timestamp"]).replace("undefined","") + "</td></tr>";
        s += cssl + "報告者" + "</td>"
               + cssr + String(feature.properties["username"]).replace("undefined","") + "</td></tr>";
        s += cssl + "判定結果" + "</td>"
               + cssr + String(feature.properties["result"]).replace("undefined","") + "</td></tr>";
      layer.bindPopup(s);
    }
  }
}
