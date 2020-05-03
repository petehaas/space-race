module.exports = {
  millionFormatter: mFormatter,
  billionFormatter: bFormatter
}
function mFormatter(num) {
 
    return (num/1000000)
  
}
function bFormatter(num) {
    
    return (num/1000000000)
  
}