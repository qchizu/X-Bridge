{
  options:{
    attribution: '',minZoom: 10,maxNativeZoom: 10, maxZoom: 18, styletype:"canvas",
  },
  geojsonOptions:{
    pointToLayer: function(feature, latlng){
      var duplicate = feature.properties["No11"];

      //全角を半角に
      function han2Zen(str) {
        return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
        });
      };

      //名称（略）
      var ryakusho = han2Zen(feature.properties["_html"]).replace("トンネル", "TN").replace("隧道", "(隧)");
      
      //よみ（略）
      var ryakuyomi = han2Zen(String(feature.properties["No1"]).replace(/undefined|とんねる|ずいどう|そくどうきょう|そくどうきよう|こどうきょう|こどうきよう|こせんきょう|こせんきよう|むめいきょう|むめいきよう|むめいばし|むめいはし|しょうばんきょう|しようばんきよう|こうかきょう|こうかきよ|ほどうきょう|ほどうきよう/g, ""));

      if ( feature.properties["_html"].indexOf('号橋') != -1) {
        ryakuyomi = ryakuyomi.replace(/ごうばし|ごうはし|ごうきょう|ごうきよう/g, "")
      };

      //名称表示の設定（拡大時のみ表示）
      var meisho = this.dealer;
      var yomi = this.dealer;
      var kigo = this.dealer;
      switch (true) {
        case (Number(String(feature.properties["No4"] ).replace("undefined",0)) < 5):
          meisho = "";
          yomi = "";
          kigo = "";
          break;
        case (GSI.GLOBALS.map.getZoom() < 15 ||Number(String(feature.properties["No4"] ).replace("undefined",0)) < 5):
          meisho = "";
          yomi = "";
          kigo = "○";
          break;
        case (GSI.GLOBALS.map.getZoom() < 16):
          meisho = ryakusho ;
          yomi = "";
          kigo = "○";
        break;
      default:
        meisho = ryakusho ;
        yomi = ""; //("【" + ryakuyomi +"】").replace("【】", "");←★この行が改変部分
        kigo =  "○";
      };
      
      var css = "<div style='font-family: BIZ UDGothic, sans-serif;font-size:16px;font-weight:bold;background-color:rgba(255,255,255,0.5);display:inline;color:rgb(164,0,53);line-height:16px;'>"

      //表示内容
      if(duplicate == 0) {
        return L.marker(latlng, {
          icon: L.divIcon({
            iconAnchor: [7 ,10],
            className : "gsi-div-icon",
            html: "<div style='"
              + "font-family: sans-serif;"
              + "font-size:14px;"
              + "display:inline;"
              + "color:rgb(164,0,53);"
              + "line-height:16px;"
              + "'>" + kigo
              + css + meisho + yomi + "</div>"
         })
       });
      } else {
        return L.marker(latlng, {
          icon: L.divIcon({
            iconAnchor: [-7 ,10 - duplicate * 20],
            className : "gsi-div-icon",
            html: css + meisho + yomi + "</div>"
          })
        });
      }
    },

    onEachFeature: function (feature, layer){
      var shubetsu = {
        "1":"橋梁",
        "2":"トンネル",
        "3":"シェッド",
        "4":"大型カルバート",
        "5":"横断歩道橋",
        "6":"門型標識等",
      };
      var s = "<table>";
        //タイトル
        s += "<tr><th colspan='2' style='font-size:16px; font-weight:bold; color:#000000; font-family:BIZ UDPGothic, sans-serif;'>" + feature.properties["_html"]  + "</th></tr>";
        //項目
        var cssl = "<tr><td style='vertical-align:middle; font-size:14px; color:#0000ff; font-family:BIZ UDPGothic, sans-serif; white-space:nowrap;'>";
        var cssr = "<td style='font-size:14px; color:#000000;'>"; 
        s += cssl + "よみ" + "</td>"
               + cssr + String(feature.properties["No1"]).replace("undefined","") + "</td></tr>";
        s += cssl + "構造物種別" + "</td>"
               + cssr + String(shubetsu[feature.properties["No13"]]).replace("undefined","") + "</td></tr>";
        s += cssl + "路線名" + "</td>"
               + cssr + String(feature.properties["No2"]).replace("undefined","") + "</td></tr>";
        s += cssl + "完成年(度)" + "</td>"
               + cssr + String(feature.properties["No3"] + "年（" + new Date(Number(feature.properties["No3"]),1,1).toLocaleDateString("ja-JP-u-ca-japanese", {year:'numeric',era:'narrow'}) + "）").replace("年（Invalid Date）","") + "</td></tr>";
        s += cssl + "延長" + "</td>"
               + cssr + String(feature.properties["No4"] + "m" ).replace("undefined","") + "</td></tr>";
        s += cssl + "幅員" + "</td>"
               + cssr + String(feature.properties["No5"] + "m" ).replace("undefined","") + "</td></tr>";
        s += cssl + "管理者名" + "</td>"
               + cssr + String(feature.properties["No6"]).replace("undefined","") + "</td></tr>";    
        s += cssl + "所在市区町村" + "</td>"
               + cssr + String(feature.properties["No7"]).replace("undefined","") + " " + String(feature.properties["No8"]).replace("undefined","") + "</td></tr>";
        s += cssl + "点検実施年度" + "</td>"
               + cssr + String(feature.properties["No9"]).replace("undefined","") + "</td></tr>";
        s += cssl + "判定区分" + "</td>"
               + cssr + String(feature.properties["No10"]).replace("undefined","").replace("1","１(健全)").replace("2","２(予防保全段階)").replace("3","３(早期措置段階)").replace("4","４(緊急措置段階)")+ "</td></tr>";
        if (String(shubetsu[feature.properties["No13"]]).replace("undefined","") == "トンネル"){
          s += cssl + "Ｑ地図管理ID" + "</td>"
             + cssr + String(feature.properties["No14"]).replace("undefined","") + "</td></tr>";};
        s += cssl + "備考" + "</td>"
             + cssr + String(feature.properties["No12"]).replace("undefined","").replace("shusei_msg","位置を修正して表示しています。修正前の経緯度：").replace("sokuchi_msg","日本測地系から全国測地系への変換を行って表示しています。").replace("jido_msg","自動処理で位置を修正して表示しています（修正後の位置が必ずしも正しいとは限りません）。修正前の経緯度：").replace("yakuba_msg","位置に誤りがあることが判明したものの、自動処理で正しい位置を推定することができなかったため、市町村役場の位置にプロットしています。修正前の経緯度：") + "　" + "</td></tr>";
        //リンク
        s += "<tr><th colspan='2' style='font-size:14px; font-weight:normal; color:#000000; font-family:BIZ UDPGothic, sans-serif;'>" 
           + 'Google' 
           + '<a href="https://www.google.com/maps/@?api=1&map_action=pano&parameters&viewpoint=' + feature.geometry["coordinates"][1] + ',' + feature.geometry["coordinates"][0] + '"' + 'target="_blank">ストリートビュー</a>' 
           + ' ／ '
           + '<a href="https://www.google.co.jp/maps/@' + feature.geometry["coordinates"][1] + ',' + feature.geometry["coordinates"][0] + ',100m/data=!3m1!1e3' + '"' + 'target="_blank">マップ</a>' 
           + "</th></tr>";
        if (String(shubetsu[feature.properties["No13"]]).replace("undefined","") == "橋梁"){
          s += "<tr><th colspan='2' style='font-size:14px; font-weight:normal; color:#000000; font-family:BIZ UDPGothic, sans-serif;'>"  
          + '<a href="https://docs.google.com/forms/d/e/1FAIpQLSc80BS5emU-c66s135SJZ3qUBA_C5-AwOEAaRqCw6bl-cdFNw/viewform?entry.206032394=' + String(feature.properties["_html"]).replace("undefined","") + '&entry.51835789=' + feature.geometry["coordinates"][1] + ',' + feature.geometry["coordinates"][0] + '"' + 'target="_blank">報告</a>（X-bridge）'
          + "</th></tr>";};
        s += "</table>";
      layer.bindPopup(s);
    }
  }
}
