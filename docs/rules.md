# Rules
Rules are defined by end users. They contain triggers and events.
Triggers are conditionals that when true, will trigger events.
A simple rule example is: "Take a photo at 12pm".

## Properties

- **Name**: rules have a name so humans can easily reference them.
- **Enabled**: on/off switch to turn rule on and off.
- **Schedule**: start/end or always on.

## Triggers & Actions
A rule can have one or more triggers. Triggers are conditions that will
activate the rule's actions.

### Triggers
Triggers are a number of conditions that must be met in order to invoke the
rule's actions. A rule may have one or more triggers. All triggers must be
true in order for the action(s) to be performed.

#### Source
The source of a trigger can come from a single devices or a group of devices
(there will be a separate page to create groups).

Triggers can also be environmental such as time or local weather.

#### Event
Every trigger corresponds to an event that is sent by something. This may be
something sent by a device, such as vibration detection, light intensity, or
magometer. The system or external global devices can also send events such as
UTC time.

#### Condition
The condition block provides logic that must pass in order for a trigger to be
triggered. Conditions are specific to the event. Every condition will have a
`method` and `value` property. `method` will explain how we're to evaluate the
`value`. There may be additional properties the condition method may need.

#### Decay
Decay specifies how long a trigger can remain fulfilled once it has
triggered true. The purpose of this value is because it would be impossible for
rules with more than one trigger to ever pass unless a single worker
received all the events needed.

eg: You have two triggers: 12pm and light sensor > 10. The time trigger would
trigger at the top of the minute. The device with the light sensor might not
send a value until 30 seconds after 12:00. Since the decay on a time event is
60 seconds, it would still be true and thus trigger the rule's actions. Without
decay, the light sensor's value would have to be received exactly at the same
time as time.

### Actions
A rule may have multiple actions that are activated once all triggers are
satisfied. Actions may be performed on individual devices or on entire groups.

#### Parameters
Every action type will have different parameters. Taking a photo will have
to allow to take `X` photos over `Y` time. Audio recording would record for `X`
seconds. Etc.

## Example
Rules do not (yet) have a language syntax, so this is simply to convey ideas
and not some undocumented language.

```
name: Take group photo when device by road vibrates
enabled: true
schedule: always-on

triggers:
  - device-002 vibration delta > 2.5  # no idea what 2.5 would mean here

actions:
  - group-001 take photo every 1 seconds for 10 seconds
```

```
name: Record audio every morning at 7am
enabled: true
schedule: always-on

triggers:
  - time is 7:00 UTC

actions:
  - device-173 record audio 30 seconds
```

## JSON proposal
I wrote this as Javascript instead of JSON because it's a bit easier to read,
but the concept remains the same.

```javascript
{
    name: 'Take group photo when device by road vibrates',
    enabled: true,
    schedule: {
        format: 'start/end',
        start: '2018-09-09T04:52:46Z',
        end: '2018-12-03T12:11:00Z',
    },
    schedule: {  // Here to show other format
        format: 'always-active'
    },

    triggers: [
        {
            // Idea here is we have a fake "device" that blasts an event every minute
            source: 'UTCTime',
            event: 'time',
            decay: '60s',
            condition: {
                method: 'equals',
                // I don't think we should allow more resolution than minutes
                value: '2018-01-01T16:22:00Z'
            }
        },
        {
            source: 'device-004',
            event: 'gyroscope',
            decay: '10s',
            condition: {
                // Trigger hits when any axis of the gyroscope changes more than 20 (20 what idk),
                // over a 10 second sliding window.
                method: 'delta',
                axis: 'any',
                range: '10s',
                value: '20'
            }
        }
    ],

    actions: [
        {
            // Group 22 will take a photo every 10 seconds until 20 photos have been taken.
            target: 'group-22',
            action: 'photo',
            params: {
                count: '20',
                interval: '10s'
            }
        }
    ]
}
```

## Quick blurb on how the system should work

Devices will send in events which contain values. Devices are connected to the
C2 via web sockets. Devices know what to send because as rules are created,
all triggers that pertain to a device are sent to the device. The value of the
event is then run through the function specified by the conditional's method
property. A true return will mean the trigger has passed.

This means depending on the source of the event, conditions for triggers may
need to be evaluated directly on the devices instead of only on the backend.

Let's take the example of a trigger that should fire when the accelerometer has
a delta > 20 (20 is arbitrary, not sure if it even makes sense in this context)
on all axes. Where do we check the conditional?

If we do it in the backend, then the device will need to be constantly
streaming accelerometer values. We'd treat devices like game controllers, just
sending inputs. This is nice, because then all logic is forced onto the
backend, but what does this do to battery life on the device? This is honestly
the most simple of solutions, because we dont have to worry about different
sized sliding windows for different triggers of the same sensor.

The second option is to push the conditional to the device itself and it can
then send a message to the backend that that trigger's condition has been met.
The biggest downfall with this solution is now there will be a lot more logic
going on in the implants/apps and we now have two completely different
codebases that implement the conditional trigger logic.


## Inspiration

- webCoRE (This thing is NUTS!): https://www.youtube.com/watch?v=jgXA_rv2-_8
- This thread has a few things: https://community.smartthings.com/t/updated-homeflow-project-a-better-way-to-create-manage-automation-rules/91025/6
  - Specifically: https://discourse-cdn-sjc1.com/smartthings/uploads/default/optimized/3X/0/2/0243a84d6f31522fc20f33db2f59315ce0f1ae5d_1_690x382.png
- openHAB rules: https://www.openhab.org/docs/configuration/rules-dsl.html#defining-rules
- Blockly can be used to build a visual language. It can run straight on the web.
  It can also support custom languages. https://developers.google.com/blockly/

## Additional triggers
Pipe dreams

- WiFi ssid
- Bluetooth IDs
- Weather
