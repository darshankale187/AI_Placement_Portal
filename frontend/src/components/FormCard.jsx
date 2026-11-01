export default function FormCard({
    title,
    fields,
    values,
    setValues,
    onSubmit,
    errors,
    submitLabel = "Save",
    onCancel,
}) {
    const change = (name, value) => setValues({ ...values, [name]: value });

    return (
        <form
            className="card"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            <h3>{title}</h3>

            {fields.map((f) => (
                <div className="field" key={f.name}>
                    <label>{f.label}</label>

                    {f.type === "textarea" ? (
                        <textarea value={values[f.name]} onChange={(e) => change(f.name, e.target.value)} />
                    ) : f.options ? (
                        <select value={values[f.name]} onChange={(e) => change(f.name, e.target.value)}>
                            <option value="">Select</option>
                            {f.options.map((o) => (
                                <option key={o} value={o}>
                                    {o}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={f.type || "text"}
                            value={values[f.name]}
                            onChange={(e) => change(f.name, e.target.value)}
                        />
                    )}

                    {errors[f.name] && <span className="error-text">{errors[f.name]}</span>}
                </div>
            ))}

            <div className="actions">
                <button className="btn" type="submit">
                    {submitLabel}
                </button>
                {onCancel && (
                    <button className="btn btn-secondary" type="button" onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}