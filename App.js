import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, NativeModules, FlatList } from 'react-native';
import Constants from 'expo-constants';
// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

var m = [100];
var allShips = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
var print = []
var i = 0
var j = 0


populateMap(m)
generateMap(m)
printMap(m, print)


function clicked() {
  window.location.reload(false);
}

export default function App() {
  
  return (
    <View>
      <Text>{print}</Text> 
        <TouchableOpacity onPress={()=> clicked()}> 
        
        <Text style={styles.paragraph}>
          Randomize
        </Text>
      </TouchableOpacity>  
    </View>
  )
}

function generateMap(map){
    var shipStartPos = 100;
    var ship = 0;
    var i = 0;
    while (i < allShips.length){
              ship = allShips[i];
              i++;
      shipStartPos = 100;
      var directionRand = 0;
      while(shipStartPos == 100) {
        shipStartPos = Math.floor(Math.random() * 100) + 1 ;
        directionRand = Math.floor(Math.random() * 2) + 0 ;  
        if(directionRand == 0) shipStartPos = findPlaceForShipHorizontal(ship, shipStartPos, map);
        else shipStartPos = findPlaceForShipVertical(ship, shipStartPos, map);
      }
      if(directionRand == 0) updateMapHorizontal(ship, shipStartPos, map);
      else updateMapVertical(ship, shipStartPos, map);
    }
  }

function findPlaceForShipHorizontal(shipLength, shipStartPos, map) {
    if(map[shipStartPos] == 0 && shipLength == 1) { //ja mīna un nav aizņemts lauciņš, apstiprinam
      return shipStartPos;
    }
    for(var i = 0; i < shipLength; i++) { //iterē cauri kuģa garumam, apskatot katru kuģim vajadzīgo laukumu
      if((shipStartPos + i) % 10 == 0 && i != 0) return 100; //ja sākas jaunā rindā un tas nav kuģa pirmais elements, tad skipojam. Tas arī čeko, vai indekss neaiziet aiz 99, kas ir outOfBounds
      if(map[shipStartPos + i] != 0) return 100; //ja lauciņš aizņemts, skipojam
    }
    return shipStartPos;
  }

function findPlaceForShipVertical(shipLength, shipStartPos, map) {
    if(map[shipStartPos] == 0 && shipLength == 1) { //ja mīna un nav aizņemts lauciņš, apstiprinam
      return shipStartPos;
    }
    for(var i = 0; i < shipLength * 10; i = i + 10) { //iterē cauri kuģa garumam, apskatot katru kuģim vajadzīgo laukumu
      if(shipStartPos + i > 99) return 100; //ja iziet ārpus laukuma rāmjiem, tas arī čeko vai index neiziet aiz 99, kas ir outOfBounds
      if(map[shipStartPos + i] != 0) return 100; //ja lauciņš aizņemts, skipojam
    }
    return shipStartPos;
  }

function updateMapHorizontal(shipLength, shipStartPos, map) { //šobrīd jau ir zināms, ka kuģis ielien pozīcijā, zinot sākuma punktu, garumu un virzienu
    for(var i = 0; i < shipLength; i++) {
      var curPos = shipStartPos + i; //konkrētais lauciņš, kuru apskatam
      if(shipLength == 1) map[shipStartPos] = 5; //ja ir mīna, tad marķējam
      else if(i == 0) map[curPos] = 4; //marķē kuģa kreiso galu
      else if(i == shipLength - 1) map[curPos] = 6; //marķē kuģa labo galu
      else map[curPos] = 45; //marķē kuģa vidusdaļu
      //tiek apkārt salikti marķējumi, lai kuģi nesaskartos
      if(curPos % 10 != 0) { //ja nav pirmā kolonna
        if(map[curPos - 1] == 0) map[curPos - 1] = 1; //ieliek marķējuma pa kreisi no kuģa
      }
      if(curPos % 10 != 9) { //ja nav pēdējā kolonna
        if(map[curPos + 1] == 0) map[curPos + 1] = 1; //ieliek marķējumu pa labi no kuģa
      }
      if(curPos > 9) { //ja nav pirmā rinda
        if(map[curPos - 10] == 0) map[curPos - 10] = 1; //ieliek marķējumu virs lauciņa
        if(curPos % 10 != 0) { //ja nav arī pirmā kolonna,
          if(map[curPos - 11] == 0) map[curPos - 11] = 1; //ieliek marķējumu pa diagonāli augšā-pa kreisi
        }
        if(curPos % 10 != 9) { //ja nav pēdējā rinda, 
          if(map[curPos - 9] == 0) map[curPos - 9] = 1; //ieliek marķējumu pa diagonāli augšā-pa labi
        }
      }
      if(curPos < 90) { //ja nav pēdējā rinda
        if(map[curPos + 10] == 0) map[curPos + 10] = 1; //ieliek marķējumu zem lauciņa
        if(curPos % 10 != 0) { //ja nav pirmā kolonna
          if(map[curPos + 9] == 0) map[curPos + 9] = 1; //ieliek marķējumu pa diagonāli lejā-pa kreisi
        }
        if(curPos % 10 != 9) { //ja nav pēdējā kolonna
          if(map[curPos + 11] == 0) map[curPos + 11] = 1; //ieliek marķējumu pa diagonāli lejā-pa labi
        }
      }
    }
  }

function updateMapVertical(shipLength, shipStartPos, map) {
    for(var i = 0; i < shipLength * 10; i = i + 10) {
      var curPos = shipStartPos + i; //konkrētais lauciņš, kuru apskatam
      if(shipLength == 1) map[shipStartPos] = 5; //ja ir mīna, tad marķējam
      else if(i == 0) map[curPos] = 8; //marķē kuģa augšējo galu
      else if(i == shipLength * 10 - 10) map[curPos] = 2; //marķē kuģa apakšējo galu
      else map[curPos] = 85; //marķē kuģa vidusdaļu
      //tiek apkārt salikti marķējumi, lai kuģi nesaskartos
      if(curPos % 10 != 0) { //ja nav pirmā kolonna
        if(map[curPos - 1] == 0) map[curPos - 1] = 1; //ieliek marķējuma pa kreisi no kuģa
      }
      if(curPos % 10 != 9) { //ja nav pēdējā kolonna
        if(map[curPos + 1] == 0) map[curPos + 1] = 1; //ieliek marķējumu pa labi no kuģa
      }
      if(curPos > 9) { //ja nav pirmā rinda
        if(map[curPos - 10] == 0) map[curPos - 10] = 1; //ieliek marķējumu virs lauciņa
        if(curPos % 10 != 0) { //ja nav arī pirmā kolonna,
          if(map[curPos - 11] == 0) map[curPos - 11] = 1; //ieliek marķējumu pa diagonāli augšā-pa kreisi
        }
        if(curPos % 10 != 9) { //ja nav pēdējā rinda, 
          if(map[curPos - 9] == 0) map[curPos - 9] = 1; //ieliek marķējumu pa diagonāli augšā-pa labi
        }
      }
      if(curPos < 90) { //ja nav pēdējā rinda
        if(map[curPos + 10] == 0) map[curPos + 10] = 1; //ieliek marķējumu zem lauciņa
        if(curPos % 10 != 0) { //ja nav pirmā kolonna
          if(map[curPos + 9] == 0) map[curPos + 9] = 1; //ieliek marķējumu pa diagonāli lejā-pa kreisi
        }
        if(curPos % 10 != 9) { //ja nav pēdējā kolonna
          if(map[curPos + 11] == 0) map[curPos + 11] = 1; //ieliek marķējumu pa diagonāli lejā-pa labi
        }
      }
    }
  }

function populateMap(map){
  for(var i = 0; i < 100; i++){
    m[i] = 0
  }
}

function printMap(m, print){
  for(i = 0; i < 100; i++){
    print[j] = m[i]
    j++
    print[j] = ' '
      if(i % 10 == 9){
      j++
      print[j] = '\n'
    }
    j++
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
