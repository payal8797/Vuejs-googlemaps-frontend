<template>
  <div class="ui grid">
    <div class="six wide column">
        <form class="ui segment large form">
            <div class="ui segment">
                <div class="field">
                    Your location:
                    <div class="ui right icon input large">
                        <input type="text" placeholder="Enter your address" v-model="coordinates"/>
                        <i class="dot circle link icon" @click="locatorButtonPressed" ><p>click here</p></i>
                    </div>
                </div>
                <div class="field">
                    <div class="two fields">
                        <div class="field">
                            Type:<select v-model="type">
                                <option value="city_hall">City Hall</option>
                                <option value="electrician">Electricity</option>
                                <option value="gas_station">Gas Supply</option>
                                <option value="fire_station">Fire Department</option>
                                <option value="health">Health Facility</option>  
                                <option value="veterinary_care">Veterinary Care</option>  
                                <option value="school">School</option>
                                <option value="university">University</option>
                                <option value="supermarket">Market</option>
                                <option value="department_store">Department Store</option>
                                <option value="clothing_store">Clothing Store</option>
                                <option value="church">Church</option>
                                <option value="mosque">Mosque</option>
                                <option value="hindu_temple">Hindu Temple</option>
                                <option value="stadium">Stadium</option>
                                <option value="amusement_park">Amusement Park</option>
                                <option value="bowling_alley">Bowling Alley</option>
                                <option value="pharmacy">Pharmacy</option>
                                <option value="hardware_store">Hardware Store</option>
                                <option value="train_station">Train Station</option>
                                <option value="bus_station">Bus Station</option>
                                <option value="taxi_stand">Taxi Stand</option>
                                <option value="transit_station">Transit Station</option>
                                <option value="airport">Airport</option>
                            </select>
                        </div>
                        <div class="field">
                            Distance:<select v-model="radius">
                                <option value="1">1 KM</option>
                                <option value="5">5 KM</option>
                                <option value="15">15 KM</option>
                                <option value="20">20 KM</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button class="ui button" @click="findNearbyButtonPressed" >Find nearby places</button>
            </div>
        </form>

        <div>
        <button class="button" @click="showModal = true"> Select items </button>
        <transition name="fade" appear>
        <div class="modal-overlay" v-if="showModal" @click="showModal = false"></div>
        </transition>
        <transition name="slide" appear>
        <div class="modal" v-if="showModal" style="max-height:500px;overflow:scroll">
            <h4>Select items to be included in the database</h4>
            <div class="checkboxes">
            <div class="item" v-for="place in places" :key="place.id">
                <div class="content">
                    <input type ="checkbox" :value="place" v-model="selectedPlaces">
                        {{place.name}}
                        
                </div>
            </div>
            </div>
            <button class="button" @click="showModal = false">Close</button>
            <button class="button" @click="submit">Submit</button>
        </div>
        </transition>
        </div>

        <div class="ui segment"  style="max-height:500px;overflow:scroll">
            <div class="ui divided items">
                <div class="item" v-for="place in places" :key="place.id">
                    <div class="content">
                        <div class="header">{{place.name}}</div>
                        <div class="meta"><b>Address :</b> {{place.vicinity}}</div>
                    </div>
                </div>
            </div>
        </div>

        </div>
    <div class="ten wide column segment ui" ref="map"></div>
  </div>
</template>


<script>

import axios from "axios";


export default{
    data(){
        return{
            type:"",
            radius:"",
            lat:0,
            lng:0,
            places:[],
            markers:[],
            showModal:false,
            selectedPlaces:[]
        };
    },


    computed:{
        coordinates() {
        return `${this.lat}, ${this.lng}`;
        }
    },
    methods:{
        locatorButtonPressed(){
            navigator.geolocation.getCurrentPosition(
            position => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
            },
            error => {
                console.log("Error getting location");
            }
            );
        },
        findNearbyButtonPressed(){
            const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat},${this.lng}
            &type=${this.type}&radius=${this.radius *1000}
            &key=AIzaSyCAUhMIdGkR1KruQw-AHMOGrqmc_K7KmnA`;
	          axios
            .get(URL)
            .then(response => {
                this.places = response.data.results;
                //if(response.data.results=[]){
                    //alert("No places nearby!! Try increasing the radius...")
                //}
                this.addLocationToGoogleMaps();
	        })
            .catch(error => {
		        console.log(error.message);
	        });
        },

        addLocationToGoogleMaps(){
            this.markers=[]
            var map = new google.maps.Map(this.$refs['map'], {
		    zoom: 10,
		    center: new google.maps.LatLng(this.lat, this.lng),
		    mapTypeId: google.maps.MapTypeId.ROADMAP
	    });

        var infowindow = new google.maps.InfoWindow();

	    this.places.forEach((place) => {
		    const lat = place.geometry.location.lat;
		    const lng = place.geometry.location.lng;
            this.markers.push({lat:lat,lng: lng})
		    let marker = new google.maps.Marker({
			    position: new google.maps.LatLng(lat, lng),
			    map: map
		});

        google.maps.event.addListener(marker, "click", () => {
	    infowindow.setContent(`
        <div class="ui header">${place.name}</div>
        <p>${place.vicinity}</p>
        `);
	    infowindow.open(map, marker);
        });
	});
    },
    submit() {
        //this.selectedPlaces=[]
        let formData = new FormData(); // create formData
            
            formData.append("arrayMaps", JSON.stringify(this.selectedPlaces)); // add the data to formData
            formData.append('type', this.type)
        axios
            .post("http://localhost:8000/api/testing_insert", formData) //create axios request
            .then(response => {
            this.showModal = false
            alert('Data has been submitted!! Click Ok to continue...')
            console.log(response) // request response
            this.selectedPlaces=[]
          })
          .catch(error => {
            console.log(error) // if request fail
          });
      }
    }
};  
 
</script>

<style scoped>

.button {
    cursor: pointer;
    display: inline-block;
    padding: 10px 20px;
    background-image: linear-gradient(to right, black, silver);
    border-radius: 8px;
    color: white;
    font-size: 15px;
    font-weight: 700;
    box-shadow: 3px 3px rgba(0, 0, 0, 0.1);
    transition: 0.4s ease-out;
}


.modal-overlay {
    position: absolute;
    z-index: 98;
}

.modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    height:100%;
    max-height:400px;
    width: 100%;
    max-width: 400px;
    background-color: silver;
    border-radius: 16px;
    padding: 25px;
    border-color:red;
}
h3 {
    color: #222;
    font-size: 32px;
    font-weight: 900;
    margin-bottom: 15px;
    }

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
 transition: transform .5s;
}

.slide-enter,
.slide-leave-to {
 transform: translateY(-50%) translateX(100vw);
}
</style>