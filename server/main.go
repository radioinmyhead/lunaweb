package main
 
import (
    "net/http"
    //"time"
)
 
func SayHello(w http.ResponseWriter, req *http.Request) {
    //time.Sleep(3*time.Second)
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Headers","Content-Type")
    w.Header().Set("content-type","application/json")
    w.Write([]byte(`[
  { "category": "Sporting Goods", "price": "$49.99",  "stocked": true,  "name": "Football" },
  { "category": "Sporting Goods", "price": "$9.99",   "stocked": true,  "name": "Baseball" },
  { "category": "Sporting Goods", "price": "$29.99",  "stocked": false, "name": "Basketball" },
  { "category": "Electronics",    "price": "$99.99",  "stocked": true,  "name": "iPod Touch" },
  { "category": "Electronics",    "price": "$399.99", "stocked": false, "name": "iPhone 5" },
  { "category": "Electronics",    "price": "$199.99", "stocked": true,  "name": "Nexus 7" }
]`))
}
 
func main() {
    http.HandleFunc("/api", SayHello)
    http.Handle("/", http.FileServer(http.Dir("./public/")))
    http.ListenAndServe(":9000", nil)
}