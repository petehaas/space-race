var http = require('http')
var console = require('console')
var dates = require('dates')
var helpers = require('./helpers')

var options = {
  format: 'json'
}
var baseUrl = 'https://api.spacexdata.com/v3/'

module.exports = {
  ships: ships,
  launches: launches,
  capsules: capsules,
  info: info,
  launchSites: launchSites,
  rockets: rockets,
  payloads: payloads
}

function ships() {

  var response = http.getUrl(baseUrl + 'ships', options);

  console.log('response', response)

  return response
}

function launches(launchId, rocketId, upcoming,previous, launchDate) {
  var launches = []

  // Just show upcoming launches
  if (upcoming) {
    var response = http.getUrl(baseUrl + 'launches/upcoming',options)
    response.forEach((launch) => {
      launches.push(createLaunch(launch,false))
    })
    // Filter by Rocket?
    if (rocketId)
      return launches.filter(a=>a.rocket.id == rocketId)
    return launches;
  }

  // Just show previous launches
  if (previous) {
    var response = http.getUrl(baseUrl + 'launches/past',options)
    response.forEach((launch) => {
      launches.push(createLaunch(launch,false))
    })
    // Filter by Rocket?
   // if (rocketId)
    //  return launches.filter()
    return launches;
  }

  // All launches
  var response = http.getUrl(baseUrl + 'launches/' +
    (launchId ? launchId : '') +
    (rocketId ? '?rocket_id=' + rocketId : '') +
    (launchDate && rocketId ?  '&start=' + launchDate[0] + '&end=' + launchDate[1] : '') + 
    (launchDate && !rocketId ? '?start=' + launchDate[0] + '&end=' + launchDate[1] : '')
    , options);

  if (launchId)
    return createLaunch(response, false)

  if (rocketId) {
    response.forEach((launch) => {
      launches.push(createLaunch(launch, false))
    })
    return launches

  }

  var latest = http.getUrl(baseUrl + 'launches/latest', options)

  response.forEach((launch) => {
    if (launch.flight_number != latest.id)
      launches.push(createLaunch(launch, false))
  })

  // Highlight the latest launch
  if (!launchDate)
    launches.push(createLaunch(latest, true))

  return launches
}

function createLaunch(launch, latest) {
  return {
    id: launch.flight_number,
    name: launch.mission_name,
    details: launch.details ? launch.details : 'N/A',
    upcoming: launch.upcoming,
    launchDate: dates.ZonedDateTime.parseDateTime(launch.launch_date_utc).format('MMM yyyy'),
    rocket: rockets(launch.rocket.rocket_id),
    success: launchSuccess(launch),
    reasonForFailure: launch.launch_failure_details ? launch.launch_failure_details.reason : 'N/A',
    videoLink: launch.links.youtube_id ? launch.links.youtube_id : 'N/A',
    images: getImages(launch),
    wikiLink: launch.links.wikipedia ? launch.links.wikipedia : 'N/A',
    latest: latest
  }

}

function launchSuccess(launch) {
  if (launch.launch_success)
    return launch.launch_success

  if (launch.launch_failure_details)
    return false

  return true

}

function capsules(capsuleId) {
  var capsules = []

  var response = http.getUrl(baseUrl + 'capsules/' + (capsuleId ? capsuleId : ''), options);

  if (capsuleId && response)
    return createCapsule(response)

  response.forEach((capsule) => {
    capsules.push(createCapsule(capsule))
  })

  return capsules

}

function createCapsule(capsule) {
  return {
    id: capsule.capsule_serial,
    status: capsule.status,
    originalLaunchDate: capsule.original_launch,
    landings: capsule.landings,
    type: capsule.type,
    details: capsule.details,
    reuseCount: capsule.reuse_count,
    missions: getMissions(capsule)
  }
}

function info() {

  var response = http.getUrl(baseUrl + 'info', options);

  var info = {
    founder: response.founder,
    founded: response.founded,
    employees: response.employees,
    launchSites: response.launch_sites,
    testSites: response.test_sites,
    ceo: response.ceo,
    cto: response.cto,
    coo: response.coo,
    ctoPropulsion: response.cto_propulsion,
    valuation: helpers.billionFormatter(response.valuation),
    summary: response.summary,
    website: response.links.website,
    headQuarters: {
      loc: {
        point: {
          latitude: 33.9213135,
          longitude: -118.329067
        }
      },
      address: 'Rocket Rd, Hawthorne CA 90250'
    }

  }

  return info
}

function rockets(rocketId) {

  var rockets = []
  var response = http.getUrl(baseUrl + 'rockets/' + (rocketId ? rocketId : ''), options);

  // return 1 
  if (rocketId) {
    return createRocket(response)
  }

  // return many
  response.forEach((rocket) => {
    rockets.push(createRocket(rocket))
  })

  return rockets

}

function payloads(payloadId) {
  var payloads = []
  var response = http.getUrl(baseUrl + 'payloads/' + (payloadId ? payloadId : ''), options)

  if (payloadId)
    return createPayload(response)

  response.forEach((payload) => {
    payloads.push(createPayload(payload))
  })

  return payloads

}

function createPayload(payload) {
  return {
    id: payload.payload_id,
    customers: payload.customers,
    nation: payload.nationality,
    manufacturer: payload.manufacturer,
    type: payload.payload_type,
    kg: payload.payload_mass_kg,
    lb: payload.payload_mass_lbs,
    orbit: payload.orbit
  }
}

function createRocket(rocket) {
  var firstFlight = dates.ZonedDateTime.of('US/Pacific', rocket.first_flight.substring(0, 4), rocket.first_flight.substring(9, 2)).format('MMMM d yyyy')

  return {
    active: rocket.active,
    stages: rockets.stages,
    boosters: rocket.boosters,
    costPerLaunch: helpers.millionFormatter(rocket.cost_per_launch),
    successRate: rocket.success_rate_pct,
    //firstFlight: rocket.first_flight,
    firstFlight: firstFlight,
    year: rocket.first_flight.substring(0, 4),
    height: {
      meters: rocket.height.meters,
      feet: rocket.height.feet
    },
    diameter: {
      meters: rocket.diameter.meters,
      feet: rocket.diameter.feet
    },
    mass: {
      kg: rocket.mass.kg,
      lb: rocket.mass.lb
    },
    payloadWeights: setPayloadWeights(rocket.payload_weights),
    firstStage: {
      reusable: rocket.first_stage.reusable,
      engines: rocket.first_stage.engines,
      fuelAmountTons: rocket.first_stage.fuel_amount_tons
    },
    secondStage: {
      reusable: rocket.second_stage.reusable,
      engines: rocket.second_stage.engines,
      fuelAmountTons: rocket.second_stage.fuel_amount_tons
    },
    engine: {
      number: rocket.engines.number,
      type: rocket.engines.type,
      version: rocket.engines.version,
      layout: rocket.engines.layout,
      propellant1: rocket.engines.propellant_1,
      propellant2: rocket.engines.propellant_2,
      thrustToWeight: rocket.engines.thrust_to_weight
    },
    images: rocket.flickr_images.map((image) => {
      return {
        url: image
      }
    }),
    wikiLink: rocket.wikipedia,
    description: rocket.description,
    name: rocket.rocket_name,
    type: rocket.rocket_type,
    id: rocket.rocket_id
  }
}

function setPayloadWeights(payloads) {
  var weights = []

  payloads.forEach((p) => {
    weights.push({
      id: p.id,
      name: p.name,
      kg: p.kg,
      lb: p.lb
    })
  })
  return weights
}

function launchSites() {
  var launchSites = []

  var response = http.getUrl(baseUrl + 'launchpads', options);

  response.forEach((site) => {
    launchSites.push({
      id: site.id,
      name: site.location.name,//site.name,
      status: site.status,
      loc: {
        point: {
          latitude: site.location.latitude,
          longitude: site.location.longitude
        }
      },
      landingAttempts: site.attempted_launches,
      successfulLandings: site.successful_launches,
      details: site.details,
      wikiLink: site.wikipedia

    })
  })

  return launchSites;
}

function getMissions(launch) {
  var missions = []

  launch.missions.forEach((mission) => {
    missions.push({
      name: mission.name,
      flight: mission.flight
    })

  })
  return missions
}

function getImages(launch) {
  var images = []

  // No image?
  if (!launch.links.mission_patch_small) 
      return [].concat({url: 'images/icons/rocket-logo-01.png'})

  images.push({
    url: launch.links.mission_patch_small
  })
  images.push({
    url: launch.links.mission_patch
  })

  if (launch.links.flicker_images)
    images.push({
      url: launch.links.flicker_images
    })


  return images

}
