requirejs(["home/src/Test"]);

function onTimeToggle(){
    requirejs(["shared/lib/Core/Time"], (e) => {
        e.Time.toggle();
    });
}