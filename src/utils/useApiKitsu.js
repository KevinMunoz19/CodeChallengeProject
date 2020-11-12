
const useApiKitsu = () => {

  const getAnimeData = (apiURL,res,rej) => {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/vnd.api+json");
    myHeaders.append("Content-Type", "application/vnd.api+json");
    myHeaders.append("Cookie", "__cfduid=d5f5453d12d2a1c6de803292f3a73e8ab1604949302");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    fetch(apiURL, requestOptions)
      .then(response => response.text())
      .then(result => {
        res(result);
      })
      .catch(error => {
        console.log('error', error)
        rej(error);
      });
  }


  return {
    getAnimeData,
  };

}

export default useApiKitsu;
